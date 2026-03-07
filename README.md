# Meeting Intelligence Hub

## Overview
**Meeting Intelligence Hub** is a platform that helps users extract meaningful insights from meeting transcripts. Instead of manually reviewing long transcripts, users can upload them and automatically generate summaries, sentiment analysis, and interact with the content using a chatbot.

The goal is to make meeting discussions **easy to understand, searchable, and actionable**.

---

## Problem Statement
Meetings often produce long transcripts that are difficult and time-consuming to read and analyze.

Manually reviewing transcripts:
- Takes a lot of time
- Makes it difficult to identify key insights
- Can cause important details to be overlooked

---

## Solution
**Meeting Intelligence Hub** allows users to upload meeting transcripts and automatically analyze the content to generate useful insights such as:

- AI-generated summaries
- Sentiment analysis
- Chatbot-based interaction with meeting content

This helps users quickly understand the important outcomes of a meeting.

---

## Tech Stack

### Frontend
- React

### Backend
- Django

### Programming Languages
- Python
- JavaScript

### Database
- SQLite (Development)
- PostgreSQL (Production)

### APIs / Libraries
- Groq AI

---

## Features
- Upload meeting transcripts
- Automatically analyze meeting content
- Generate AI-based summaries
- Sentiment analysis of meeting discussions
- Chatbot interaction with meeting transcripts

---

# Project Setup

## 1. Clone the Repositories

### Backend
```bash
git clone https://github.com/ardra-m-siva/meeting-intelligence-server.git
```

### Frontend
```bash
git clone https://github.com/ardra-m-siva/meeting-intelligence.git
```

---

# Backend Setup

### Step 1: Navigate to backend folder
```bash
cd meeting-intelligence-server
```

### Step 2: Create virtual environment
```bash
python -m venv venv
```

### Step 3: Activate virtual environment
```bash
venv\Scripts\activate
```

### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Create `.env` file

Create a `.env` file in the root directory and add:

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
GROQ_API_KEY=
```

### Step 6: Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Start backend server
```bash
python manage.py runserver
```

---

# Frontend Setup

### Step 1: Navigate to frontend folder
```bash
cd meeting-intelligence
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start development server
```bash
npm run dev
```

---

# Running the Application

After starting both servers, open the application in your browser:

```
http://localhost:5173
```

*(Port may vary depending on your frontend setup.)*