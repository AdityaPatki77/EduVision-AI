<<<<<<< HEAD
# EduVision-AI

_Auto-Generate Interactive Video Lessons from YouTube or Uploaded Lectures_

##  What It Does
- Converts long lecture videos into:
  - Summarized notes
  - Auto-generated quizzes (MCQs)
  - Visual diagrams
  - Short recap videos
  - Interactive TTS quiz bot

##  Architecture
- Frontend: Next.js
- Backend API: Go (Gin / Fiber)
- AI Service: Python FastAPI + Hugging Face
- Database: PostgreSQL / Supabase
- Video Processing: yt-dlp + ffmpeg

##  How It Works
1. User submits YouTube URL / Uploads video
2. Backend stores metadata
3. AI service extracts:
   - Transcripts (Whisper)
   - Summaries (BART / Pegasus)
   - Quizzes (T5)
   - Diagrams (CLIP / Vision models)
   - TTS (Bark / espnet)
4. Frontend displays interactive learning experience

##  Tech Stack
- Go 1.22+ (Backend)
- Python 3.9+ (AI services)
- Hugging Face Transformers
- Next.js (Frontend)
- PostgreSQL / Supabase
- ffmpeg / yt-dlp

##
### 
- Go 1.22+
- Python 3.9+
- Node.js 20.x
- PostgreSQL or Supabase
- ffmpeg + yt-dlp


=======
# EduVision-AI
>>>>>>> e85d3dc9630d5b52f5e6bb251ee1994eff93491a
