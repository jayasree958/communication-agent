import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from '../../server/routes/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Normalize incoming Netlify serverless function path
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
  } else if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/';
  }
  next();
});

// Explicit health route handler for serverless functions
app.get('/health', (req, res) => {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.VITE_GEMINI_API_KEY,
    process.env.NETLIFY_GEMINI_API_KEY,
    process.env.API_KEY
  ];
  let isKeyConfigured = false;
  for (const k of keys) {
    if (k && typeof k === 'string') {
      const trimmed = k.trim().replace(/^["']|["']$/g, '');
      if (trimmed !== '' && !trimmed.includes('your_actual_gemini_api_key_here')) {
        isKeyConfigured = true;
        break;
      }
    }
  }

  res.json({
    status: 'ok',
    geminiConfigured: isKeyConfigured,
    message: isKeyConfigured
      ? 'Gemini API is securely configured on Netlify serverless.'
      : 'GEMINI_API_KEY environment variable is missing.'
  });
});

app.use('/', apiRouter);

export const handler = serverless(app);
