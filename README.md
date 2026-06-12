# Slidesync.ai

**Slidesync.ai** is an interactive web application that transforms your static PowerPoint presentations into professional, narrated audio experiences in seconds.

Simply upload a `.pptx` file, and Slidesync will automatically extract your slides and speaker notes, synthesize natural-sounding AI voiceovers for each slide, and generate a view-only link you can share with anyone.

## Key Features
- **Instant Extraction**: Drag and drop PowerPoint files to instantly extract slides and speaker notes.
- **AI Voice Synthesis**: Convert your presentation notes into high-quality audio narration.
- **Shareable Links**: Generate secure, view-only links to share your narrated presentations.
- **Project Dashboard**: Automatically saves your work history and uploads so you can pick up where you left off.
- **Beautiful UI**: A custom-built, glassmorphic React interface designed for a premium user experience.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS, Lucide Icons
- **Backend**: Python, FastAPI, SQLite
- **Presentation Processing**: `python-pptx`, `aspose.slides`

## Local Development

### 1. Backend Setup
Navigate to the backend directory and run the FastAPI server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
Navigate to the frontend directory and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to start generating audio presentations!
