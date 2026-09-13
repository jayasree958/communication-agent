import express from 'express';
import {
  generateLiveSignal,
  evaluateSession,
  generateAdaptiveInterviewQuestion,
  evaluateInterviewAnswer,
  generateStoryCoaching,
  generateWitChallenge
} from '../services/geminiService.js';
import { getProgress, saveSessionResult } from '../services/progressStore.js';

const router = express.Router();

// Health check and Gemini API key status check
router.get('/health', (req, res) => {
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
      ? 'Gemini API is securely configured on server.'
      : 'GEMINI_API_KEY environment variable is missing. Set it in Netlify Environment Variables or .env file.'
  });
});

// Live coaching feedback signal
router.post('/coach/live', async (req, res) => {
  try {
    const { transcript, metrics = {}, mode = 'Free Speaking' } = req.body;
    const signal = await generateLiveSignal(transcript, metrics, mode);
    res.json(signal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post-session deep evaluation
router.post('/coach/analyze', async (req, res) => {
  try {
    const { transcript, metrics = {}, mode = 'Free Speaking', extraData = {}, durationSeconds = 0 } = req.body;
    const analysis = await evaluateSession(transcript, metrics, mode, extraData);
    
    // Save to user progress and error memory
    const updatedProgress = saveSessionResult({
      transcript,
      metrics,
      mode,
      analysis,
      durationSeconds
    });

    res.json({ analysis, progress: updatedProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adaptive interview question endpoint (with Role & Experience Level support)
router.post('/coach/interview-next', async (req, res) => {
  try {
    const {
      history = [],
      lastAnswer = '',
      interviewerType = 'Professional',
      difficultyLevel = 1,
      jobRole = 'Software Engineer',
      experienceLevel = 'Fresher'
    } = req.body;

    const result = await generateAdaptiveInterviewQuestion(
      history,
      lastAnswer,
      interviewerType,
      difficultyLevel,
      jobRole,
      experienceLevel
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluate interview answer (Dual Evaluation: WHAT + HOW, tailored for Role & Experience Level)
router.post('/coach/interview-eval', async (req, res) => {
  try {
    const {
      question,
      answer,
      audioMetrics = {},
      interviewerType = 'Professional',
      jobRole = 'Software Engineer',
      experienceLevel = 'Fresher'
    } = req.body;

    const evalResult = await evaluateInterviewAnswer(
      question,
      answer,
      audioMetrics,
      interviewerType,
      jobRole,
      experienceLevel
    );
    res.json(evalResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Storytelling retraining loop endpoint
router.post('/coach/story-coaching', async (req, res) => {
  try {
    const { round = 1, storyText = '', promptTopic = 'A turning point decision' } = req.body;
    const coaching = await generateStoryCoaching(round, storyText, promptTopic);
    res.json(coaching);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Wit training endpoint
router.post('/coach/wit-challenge', async (req, res) => {
  try {
    const { transcript = '', topic = '' } = req.body;
    const witResult = await generateWitChallenge(transcript, topic);
    res.json(witResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch progress history & error memory
router.get('/progress', (req, res) => {
  try {
    const data = getProgress();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
