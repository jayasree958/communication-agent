import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/user_progress.json');

// Ensure data folder exists
function ensureDataFolder() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
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
        { date: 'Initial', power: 65, storytelling: 60, interview: 62, clarity: 68 },
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

export function getProgress() {
  ensureDataFolder();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading progress file:', err.message);
    return { sessions: [], errorMemory: {}, skillsProgress: [] };
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

  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2));
  return current;
}
