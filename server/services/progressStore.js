import fs from 'fs';
import path from 'path';
import os from 'os';

// In serverless environment (Netlify/AWS Lambda), use /tmp if primary directory is read-only
const PRIMARY_DATA_FILE = path.join(process.cwd(), 'server/data/user_progress.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'impact_user_progress.json');

// In-memory fallback
let inMemoryProgress = {
  sessions: [],
  errorMemory: {
    "fillerWords": 0,
    "fastSpeaking": 0,
    "weakHooks": 0,
    "rambling": 0,
    "lackOfEvidence": 0,
    "monotoneDelivery": 0
  },
  skillsProgress: [
    { date: 'Initial', power: 65, storytelling: 60, interview: 62, clarity: 68 }
  ]
};

function getActiveFilePath() {
  try {
    const primaryDir = path.dirname(PRIMARY_DATA_FILE);
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    return PRIMARY_DATA_FILE;
  } catch (err) {
    return TMP_DATA_FILE;
  }
}

function ensureDataFolder() {
  const filePath = getActiveFilePath();
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(inMemoryProgress, null, 2));
    } catch (err) {
      console.warn('Could not write initial progress file, using in-memory store:', err.message);
    }
  }
}

export function getProgress() {
  ensureDataFolder();
  const filePath = getActiveFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      inMemoryProgress = JSON.parse(raw);
    }
    return inMemoryProgress;
  } catch (err) {
    console.warn('Error reading progress file, returning in-memory:', err.message);
    return inMemoryProgress;
  }
}

export function saveSessionResult(sessionData) {
  ensureDataFolder();
  const current = getProgress();
  
  const newSession = {
    id: 'sess_' + Date.now(),
    timestamp: new Date().toISOString(),
    mode: sessionData.mode,
    communicationPower: sessionData.analysis?.communicationPower || 75,
    scores: sessionData.analysis?.scores || {},
    biggestWeakness: sessionData.analysis?.biggestWeakness || '',
    oneBigUpgrade: sessionData.analysis?.oneBigUpgrade || '',
    durationSeconds: sessionData.durationSeconds || 0,
    transcriptSnippet: (sessionData.transcript || '').slice(0, 200)
  };

  current.sessions.unshift(newSession);

  // Update error memory counters based on analysis
  const weaknessStr = (sessionData.analysis?.biggestWeakness || '').toLowerCase();
  if (weaknessStr.includes('filler')) current.errorMemory.fillerWords = (current.errorMemory.fillerWords || 0) + 1;
  if (weaknessStr.includes('fast') || weaknessStr.includes('pace')) current.errorMemory.fastSpeaking = (current.errorMemory.fastSpeaking || 0) + 1;
  if (weaknessStr.includes('hook') || weaknessStr.includes('opening')) current.errorMemory.weakHooks = (current.errorMemory.weakHooks || 0) + 1;
  if (weaknessStr.includes('rambl') || weaknessStr.includes('long')) current.errorMemory.rambling = (current.errorMemory.rambling || 0) + 1;
  if (weaknessStr.includes('evidence') || weaknessStr.includes('metric') || weaknessStr.includes('number')) current.errorMemory.lackOfEvidence = (current.errorMemory.lackOfEvidence || 0) + 1;
  if (weaknessStr.includes('monotone') || weaknessStr.includes('energy')) current.errorMemory.monotoneDelivery = (current.errorMemory.monotoneDelivery || 0) + 1;

  // Append progress point
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  current.skillsProgress.push({
    date: formattedDate,
    power: newSession.communicationPower,
    storytelling: newSession.scores.storytelling || newSession.communicationPower,
    interview: newSession.scores.interviewImpact || newSession.communicationPower,
    clarity: newSession.scores.clarity || newSession.communicationPower
  });

  // Keep last 30 sessions & last 20 progress data points
  if (current.sessions.length > 30) current.sessions = current.sessions.slice(0, 30);
  if (current.skillsProgress.length > 20) current.skillsProgress = current.skillsProgress.slice(-20);

  inMemoryProgress = current;

  try {
    const filePath = getActiveFilePath();
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2));
  } catch (err) {
    console.warn('Could not persist session result to disk, saved in-memory:', err.message);
  }

  return current;
}

