
# EduVision AI – AI-Powered Video Learning Assistant

EduVision AI is a generative AI-based platform that transforms educational YouTube videos into structured and interactive learning content. The system extracts transcripts, generates intelligent summaries and quiz questions, and provides an AI assistant to enhance user understanding and engagement. The platform is designed for students, educators, and self-learners seeking an efficient and accessible learning experience from video content.

## Features

- Transcript extraction from YouTube videos using the YouTube Transcript API.
- Automatic summarization of video content using Gemini large language model.
- Generation of context-aware quiz questions from video transcripts.
- Interactive chatbot assistant powered by MistralAI, capable of answering user queries based on transcript content.
- "Generate More Questions" feature for dynamic quiz regeneration.
- Dual-backend architecture using GoLang (routing/API layer) and Python (AI inference engine).
- Fully responsive frontend built with React.js and Tailwind CSS.
- Processing pipeline optimized to reduce average response time from approximately 50 seconds to 10 seconds.

## Technology Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** GoLang (API Routing), Python (LLM Inference)  
**AI Models:** Gemini API (Summary, Question Generation), MistralAI (Chatbot)  
**APIs:** YouTube Transcript API  
**Tools:** Git, GitHub, REST APIs, Agile Workflow  

## System Architecture

```
User (Frontend)
    ↓
GoLang Backend (API Gateway)
    ↓
Python Backend (Inference Engine)
    ├── Transcript → Summary → Question Generation (Gemini)
    └── Chatbot Interaction (MistralAI)
```

## Workflow

1. The user provides a YouTube video link.
2. The system retrieves the transcript using the YouTube Transcript API.
3. The Gemini model generates a summary and relevant quiz questions.
4. The chatbot, powered by MistralAI, answers user questions based on the transcript context.
5. Users can request additional questions via a dedicated interface button.

## Folder Structure

```
/client         → Frontend application (React.js)
/server-go      → Go backend for API routing
/server-python  → Python backend for AI model processing
/docs           → Documentation and architecture files
```

## Future Enhancements

- Integration of multiple question formats.
- Text-to-speech functionality for accessibility.
- Support for content types beyond video (e.g., lecture PDFs).
- Expansion to include visual-based content understanding.

## Author

**Aditya Patki**  
GitHub: https://github.com/AdityaPatki77  
LinkedIn: https://linkedin.com/in/aditya-patki

## License

This project is released under the MIT License.
