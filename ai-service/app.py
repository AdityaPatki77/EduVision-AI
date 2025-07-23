import os
import json
import requests
import asyncio
import time
import re
import hashlib
from urllib.parse import urlparse, parse_qs
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

app = FastAPI()

# --- CORS Middleware Configuration ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # For Vite default port
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
# Make sure to set your GOOGLE_API_KEY as an environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("🔴 Google API key not found. Please set the GOOGLE_API_KEY environment variable.")

genai.configure(api_key=GOOGLE_API_KEY)
generation_config = genai.GenerationConfig(
    temperature=0.4, # <<< MODIFIED: Slightly increased for more varied questions on refresh
    top_p=0.9,
    max_output_tokens=2048,
)
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

# --- Performance and Other Configurations ---
# MAX_TRANSCRIPT_LENGTH = 8000 # <<< MODIFIED: This is no longer needed as we process the full transcript
SUMMARY_MAX_LENGTH = 250
MAX_QUESTIONS = 10
MAX_RETRIES = 2

# --- Request Models ---
class VideoURL(BaseModel):
    url: str

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
    """
    Extracts the YouTube video ID from various common URL formats.
    """
    regex = r"(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None

def clean_transcript(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# --- Transcript Fetching ---
async def transcribe_audio_async(video_url: str) -> tuple[str, str]:
    """
    Fetches transcript and returns it along with a unique identifier for caching.
    """
    video_id = get_youtube_video_id(video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid or unsupported YouTube URL format.")

    normalized_identifier = f"youtube_video_{video_id}"
    cached_data = await load_from_cache(normalized_identifier, "transcript")
    if cached_data:
        return cached_data["transcript"], normalized_identifier

    try:
        transcript_list = await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
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
    # <<< MODIFIED: Removed slicing to use the full transcript
    prompt = f'Please provide a concise, easy-to-read summary of the following video transcript. The summary should be about {SUMMARY_MAX_LENGTH} words.\n\nTranscript:\n"{transcript_text}"'
    try:
        response = await model.generate_content_async(prompt)
        summary_text = response.text.strip()
        await save_to_cache(identifier, {"summary": summary_text}, "summary")
        return summary_text
    except Exception as e:
        print(f"❌ API-based summarization failed: {e}")
        return " ".join(transcript_text.split()[:100]) + "..."

# --- API-Based MCQ Generation ---
# <<< MODIFIED: Added force_refresh parameter to bypass caching
async def generate_mcq_questions_api_async(transcript: str, identifier: str, force_refresh: bool = False) -> list:
    # <<< MODIFIED: Check cache only if not forcing a refresh
    if not force_refresh:
        cached_data = await load_from_cache(identifier, "questions")
        if cached_data:
            return cached_data["questions"]

    print("❓ Generating MCQ questions via API...")
    # <<< MODIFIED: Updated prompt to ask for distributed questions from the entire transcript
    prompt = f'''
    Generate {MAX_QUESTIONS} multiple-choice questions based on the ENTIRETY of the following transcript.
    The questions should be distributed, covering topics from the beginning, middle, and end of the video.

    IMPORTANT REQUIREMENTS:
    1. Each question must have exactly 4 options.
    2. Only one option should be correct.
    3. Return ONLY a valid JSON array of objects with this exact structure, nothing else:
    [
      {{
        "question": "What is the main topic?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option B"
      }}
    ]
    The "answer" must be one of the strings from the "options" list.

    Transcript:
    {transcript}
    '''

    for attempt in range(MAX_RETRIES):
        try:
            response = await model.generate_content_async(prompt)
            raw_text = response.text.strip()
            # A more robust regex to find the JSON array
            json_match = re.search(r'\[.*\]', raw_text, re.DOTALL)
            if not json_match:
                # Handle cases where the model might wrap the JSON in json ... 
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:-3].strip()
                json_match = re.search(r'\[.*\]', raw_text, re.DOTALL)
                if not json_match:
                    raise ValueError("No JSON array found in the response.")
            
            json_string = json_match.group(0)
            questions = json.loads(json_string)

            if isinstance(questions, list) and all(
                isinstance(q, dict) and "question" in q and "options" in q and "answer" in q
                and isinstance(q["options"], list) and len(q["options"]) == 4
                and q["answer"] in q["options"]
                for q in questions
            ):
                # <<< MODIFIED: Always save the newly generated questions to cache
                await save_to_cache(identifier, {"questions": questions}, "questions")
                return questions
            else:
                raise ValueError("Parsed JSON doesn't match expected MCQ format.")
        except Exception as e:
            print(f"❌ API MCQ generation attempt {attempt + 1} failed: {e}")
            if attempt >= MAX_RETRIES - 1:
                return [{"question": "Could not generate questions.", "options": ["A", "B", "C", "D"], "answer": "A"}]
            await asyncio.sleep(1)

# --- Main Processing Endpoint ---
@app.post("/process_video")
async def process_video_endpoint(video: VideoURL):
    start_time = time.time()
    print(f"🚀 Starting full processing for {video.url}")
    
    try:
        transcript_text, normalized_identifier = await transcribe_audio_async(video.url)
        
        summary_task = summarize_transcript_api_async(transcript_text, normalized_identifier)
        questions_task = generate_mcq_questions_api_async(transcript_text, normalized_identifier)
        
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
        print(f"❌ Full processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# <<< MODIFIED: Added a new endpoint for refreshing questions >>>
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)