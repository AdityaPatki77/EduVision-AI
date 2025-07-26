import os
import json
import requests
import asyncio
import time
import re
import hashlib
from urllib.parse import urlparse, parse_qs
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
# CORRECTED: Import the correct async client class name
from mistralai.async_client import MistralAsyncClient
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

# --- Load environment variables from .env file ---
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# --- CORS Middleware Configuration ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
CACHE_DIR = "cache"
os.makedirs(CACHE_DIR, exist_ok=True)

# --- Google Generative AI API Configuration ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("🔴 Google API key not found. Please set the GOOGLE_API_KEY environment variable in your .env file.")

genai.configure(api_key=GOOGLE_API_KEY)
generation_config = genai.GenerationConfig(
    temperature=0.4,
    top_p=0.9,
    max_output_tokens=2048,
)
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]
gemini_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

# --- Mistral AI API Configuration (Updated) ---
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("🔴 Mistral API key not found. Please set the MISTRAL_API_KEY environment variable in your .env file.")

# CORRECTED: Initialize the MistralAsyncClient for use in an async app
mistral_client = MistralAsyncClient(api_key=MISTRAL_API_KEY)
MISTRAL_MODEL_NAME = "mistral-small-latest" 

# --- Performance and Other Configurations ---
SUMMARY_MAX_LENGTH = 250
MAX_QUESTIONS = 10
MAX_RETRIES = 2

# --- Request Models ---
class VideoURL(BaseModel):
    url: str

class QuestionRequest(BaseModel):
    url: str
    question: str
    chat_history: List[Dict[str, str]] = []

@app.get("/")
async def read_root():
    return {"status": "EduVision AI Service - Powered by Cloud APIs"}

# --- Caching System ---
def get_cache_path(identifier: str, type: str) -> str:
    identifier_hash = hashlib.sha256(identifier.encode('utf-8')).hexdigest()
    return os.path.join(CACHE_DIR, f"{identifier_hash}_{type}.json")

async def load_from_cache(identifier: str, type: str):
    cache_path = get_cache_path(identifier, type)
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Cache corrupted for {type}: {e}")
            try:
                os.remove(cache_path)
            except OSError:
                pass
    return None

async def save_to_cache(identifier: str, data: dict, type: str):
    cache_path = get_cache_path(identifier, type)
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"❌ Cache save failed for {type}: {e}")

# --- YouTube and Text Processing ---
def get_youtube_video_id(url: str) -> str | None:
    regex = r"(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    return match.group(1) if match else None

def clean_transcript(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()

# --- Transcript Fetching ---
async def transcribe_audio_async(video_url: str) -> tuple[str, str]:
    video_id = get_youtube_video_id(video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid or unsupported YouTube URL format.")
    normalized_identifier = f"youtube_video_{video_id}"
    cached_data = await load_from_cache(normalized_identifier, "transcript")
    if cached_data:
        return cached_data["transcript"], normalized_identifier
    try:
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            transcript_list = await loop.run_in_executor(
                pool, YouTubeTranscriptApi.get_transcript, video_id
            )
        transcript_text = " ".join([entry['text'] for entry in transcript_list])
        transcript_text = clean_transcript(transcript_text)
        await save_to_cache(normalized_identifier, {"transcript": transcript_text}, "transcript")
        return transcript_text, normalized_identifier
    except (NoTranscriptFound, TranscriptsDisabled) as e:
        raise HTTPException(status_code=404, detail=f"Could not retrieve transcript: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during transcription: {e}")

# --- API-Based Summarization ---
async def summarize_transcript_api_async(transcript_text: str, identifier: str) -> str:
    cached_data = await load_from_cache(identifier, "summary")
    if cached_data:
        return cached_data["summary"]
    print("📝 Generating summary via API...")
    prompt = f'Please provide a concise summary of the following transcript, about {SUMMARY_MAX_LENGTH} words.\n\nTranscript:\n"{transcript_text}"'
    try:
        response = await gemini_model.generate_content_async(prompt)
        summary_text = response.text.strip()
        await save_to_cache(identifier, {"summary": summary_text}, "summary")
        return summary_text
    except Exception as e:
        print(f"❌ API-based summarization failed: {e}")
        return " ".join(transcript_text.split()[:100]) + "..."

# --- API-Based MCQ Generation ---
async def generate_mcq_questions_api_async(transcript: str, identifier: str, force_refresh: bool = False) -> list:
    if not force_refresh:
        cached_data = await load_from_cache(identifier, "questions")
        if cached_data and cached_data.get("questions"):
            return cached_data["questions"]

    print("❓ Generating MCQ questions via API...")
    
    # Define a specific generation config to enforce JSON output
    json_generation_config = genai.GenerationConfig(response_mime_type="application/json")

    prompt = f'''
    Based on the following transcript, generate {MAX_QUESTIONS} multiple-choice questions.
    Ensure questions cover topics from the beginning, middle, and end of the transcript.

    Your output MUST be a valid JSON array of objects, where each object has the following structure:
    - "question": A string for the question text.
    - "options": An array of exactly 4 string options.
    - "answer": A string that is an exact match to one of the 4 options.

    Example format:
    [
      {{"question": "What is the primary topic?", "options": ["A", "B", "C", "D"], "answer": "B"}}
    ]

    Transcript:
    ---
    {transcript}
    ---
    '''

    for attempt in range(MAX_RETRIES):
        try:
            # Pass the JSON-specific config with the request
            response = await gemini_model.generate_content_async(
                prompt,
                generation_config=json_generation_config
            )
            
            # The response.text is now a guaranteed JSON string, no cleaning needed
            questions = json.loads(response.text)
            
            # Perform validation to be safe
            if isinstance(questions, list) and all(
                isinstance(q, dict) and "question" in q and "options" in q and "answer" in q
                and isinstance(q["options"], list) and len(q["options"]) == 4
                and q["answer"] in q["options"]
                for q in questions
            ):
                await save_to_cache(identifier, {"questions": questions}, "questions")
                return questions
            else:
                # This error now indicates a fundamental structure mismatch from the AI
                raise ValueError("Validated JSON structure does not match the expected MCQ format.")

        except Exception as e:
            print(f"❌ API MCQ generation attempt {attempt + 1} failed: {e}")
            if attempt >= MAX_RETRIES - 1:
                # Return a clear error object if all retries fail
                return [{"question": "Error: Could not generate valid questions from the video content.", "options": ["-", "-", "-", "-"], "answer": "-"}]
            await asyncio.sleep(2) # Increased sleep time for retries

# --- Chatbot Q&A Function using Mistral AI ---
async def answer_question_mistral_async(transcript: str, question: str, chat_history: List[Dict[str, str]]) -> str:
    print(f"🤖 Answering question using Mistral AI: '{question}'")

    messages = [
        {
            "role": "system", 
            "content": f"""You are a helpful AI assistant named 'EduVision AI'. Your goal is to answer questions based ONLY on the provided video transcript. Do not use any external knowledge. If the answer is not in the transcript, say "I'm sorry, but the answer to that question isn't available in the video transcript."

Here is the full video transcript:
---
{transcript}
---"""
        }
    ]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": question})

    try:
        response = await mistral_client.chat(
            model=MISTRAL_MODEL_NAME,
            messages=messages,
            temperature=0.2,
            max_tokens=512,
        )
        
        answer_text = response.choices[0].message.content
        return answer_text.strip()

    except Exception as e:
        print(f"❌ Mistral AI API call failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get an answer from the AI assistant.")

# --- Endpoints ---
@app.post("/process_video")
async def process_video_endpoint(video: VideoURL):
    start_time = time.time()
    try:
        transcript_text, identifier = await transcribe_audio_async(video.url)
        summary_task = summarize_transcript_api_async(transcript_text, identifier)
        questions_task = generate_mcq_questions_api_async(transcript_text, identifier)
        summary, questions = await asyncio.gather(summary_task, questions_task)
        elapsed = time.time() - start_time
        print(f"🎯 Full processing completed in {elapsed:.2f}s")
        return {
            "transcript": transcript_text,
            "summary": summary,
            "questions": questions,
            "processing_time": f"{elapsed:.2f}s",
            "video_url": video.url
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refresh_questions")
async def refresh_questions_endpoint(video: VideoURL):
    """
    Endpoint to regenerate MCQs for a given video URL, bypassing the question cache.
    """
    start_time = time.time()
    print(f"🔄 Refreshing questions for {video.url}")

    try:
        # Step 1: Get the transcript (will use cache if available, which is fast)
        transcript_text, normalized_identifier = await transcribe_audio_async(video.url)

        # Step 2: Generate new questions, forcing a regeneration by skipping the cache
        questions = await generate_mcq_questions_api_async(transcript_text, normalized_identifier, force_refresh=True)
        
        elapsed = time.time() - start_time
        print(f"👍 Questions refreshed in {elapsed:.2f}s")

        return {"questions": questions}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ Question refresh failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask_question")
async def ask_question_endpoint(req: QuestionRequest):
    start_time = time.time()
    try:
        transcript_text, _ = await transcribe_audio_async(req.url)
        answer = await answer_question_mistral_async(transcript_text, req.question, req.chat_history)
        elapsed = time.time() - start_time
        print(f"💬 Answer generated in {elapsed:.2f}s")
        return {"answer": answer}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Main Execution Block ---
if __name__ == "__main__":
    import uvicorn
    # Corrected the uvicorn.run command to match the filename 'app.py'
    # To run, use the command in your terminal: uvicorn app:app --reload
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)