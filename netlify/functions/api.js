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

app.use('/', apiRouter);

export const handler = serverless(app);
