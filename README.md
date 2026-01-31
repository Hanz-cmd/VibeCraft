# VibeCraft - AI Virtual Wardrobe

AI-powered virtual wardrobe that helps you catalog clothes and generate outfit combinations.

## Features
- 📸 Photo upload with AI categorization
- 🎨 AI outfit generator
- 🌤️ Weather-based recommendations
- 💾 Save favorite outfits
- 🔍 Filter by category

## Setup

### 1. Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_openweathermap_key_here
```

Get API keys:
- Gemini: https://aistudio.google.com/app/apikey (free)
- Weather: https://openweathermap.org/api (free)

Start backend:
```bash
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack
- **Backend**: Node.js, Express, Google Gemini AI
- **Frontend**: React, Vite
- **AI**: Gemini 1.5 Flash for image analysis & outfit generation

## Deployment

### Backend (Railway/Render/Heroku)
1. Push to GitHub (without .env)
2. Add environment variables in hosting dashboard
3. Deploy

### Frontend (Vercel/Netlify)
1. Update API URL in frontend code
2. Deploy

---

Built for hackathon 🚀
