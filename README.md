# Project Title
Meeting Intelligence Hub

## The Problem
Meetings often contain important discussions, but it is difficult to remember everything that was said. Manually writing notes and summaries takes time and can miss important details.

## The Solution
Meeting Intelligence Hub allows users to upload meeting recordings and automatically generate transcripts. The system also analyzes the meeting content to provide insights such as summaries and sentiment analysis.

## Tech Stack
- Frontend: React
- Backend: Django
- Programming Language: Python, JavaScript
- Database: SQLite / PostgreSQL
- APIs / Libraries: gorq ai

## Setup Instructions

### 1. Clone the repository
### 2. Backend Setup
    git clone https://github.com/ardra-m-siva/meeting-intelligence-server.git

    run: 
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
### 3. Frontend Setup
    git clone https://github.com/ardra-m-siva/meeting-intelligence.git

    run:
    npm install
    npm run dev
### 4. Open the Application in brower
---

## Features
- Upload meeting recordings
- Automatic transcription
- View meeting transcripts
- Chatbot interaction
- Sentiment analysis


### .env---------------
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
GROQ_API_KEY=