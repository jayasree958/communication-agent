import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MediaEngine, AudioMetrics } from '../services/mediaEngine';
import { SpeechRecognitionEngine, SpeechStats } from '../services/speechRecognition';

export type TrainingMode = 
  | 'Free Speaking'
  | 'Storytelling'
  | 'Public Speaking'
  | 'Conversation'
  | 'Wit Training'
  | 'Interview'
  | 'Rapid Response'
  | 'Audience Simulation';

export type SessionState = 'idle' | 'active' | 'analyzing' | 'report';

export interface LiveSignal {
  signal: string;
  message: string;
  type: 'positive' | 'warning' | 'insight';
  timestamp: number;
}

export interface SessionReport {
  communicationPower: number;
  scores: Record<string, number>;
  whatWorked: string[];
  biggestWeakness: string;
  oneBigUpgrade: string;
  top3Improvements: string[];
  practiceExercise: {
    title: string;
    instruction: string;
  };
  memorabilityAssessment?: {
    score: number;
    whatListenerRemembers: string;
    howToMakeUnforgettable: string;
  };
  transcript?: string;
  durationSeconds?: number;
  wordCount?: number;
  wpm?: number;
  fillerCount?: number;
}

interface SessionContextType {
  mode: TrainingMode;
  setMode: (mode: TrainingMode) => void;
  sessionState: SessionState;
  setSessionState: (state: SessionState) => void;
  
  // Media & Transcripts
  isMediaActive: boolean;
  audioMetrics: AudioMetrics;
  speechStats: SpeechStats;
  liveSignal: LiveSignal | null;
  signalHistory: LiveSignal[];
  sessionTimerSeconds: number;
  
  // Actions
  startSession: (videoElement?: HTMLVideoElement) => Promise<boolean>;
  stopAndAnalyzeSession: () => Promise<void>;
  resetSession: () => void;
  appendManualText: (text: string) => void;
  
  // Interview Customization State
  jobRole: string;
  setJobRole: (role: string) => void;
  experienceLevel: string;
  setExperienceLevel: (level: string) => void;
  interviewerType: string;
  setInterviewerType: (type: string) => void;
  difficultyLevel: number;
  setDifficultyLevel: (level: number) => void;
  currentInterviewQuestion: any;
  interviewHistory: Array<{ question: string; answer: string; feedback?: any }>;
  submitInterviewAnswer: (answerText: string) => Promise<void>;
  fetchNewInterviewQuestion: (roleOverride?: string, expOverride?: string) => Promise<void>;

  // Story state
  storyRound: number;
  storyTopic: string;
  setStoryTopic: (topic: string) => void;
  storyCoaching: any;
  submitStoryRound: (storyText: string) => Promise<void>;
  
  // Wit state
  witTopic: string;
  setWitTopic: (topic: string) => void;
  witResult: any;
  submitWitAttempt: (attemptText: string) => Promise<void>;

  // Post Session Report
  currentReport: SessionReport | null;
  progressData: any;
  isGeminiConfigured: boolean;
  refreshHealthCheck: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<TrainingMode>('Interview');
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [isMediaActive, setIsMediaActive] = useState(false);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(true);

  // Audio / Speech Engine refs
  const mediaEngineRef = useRef<MediaEngine | null>(null);
  const speechEngineRef = useRef<SpeechRecognitionEngine | null>(null);

  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics>({
    volumeRms: 0,
    pitchVariance: 0,
    wpm: 135,
    fillerCount: 0,
    pauseCount: 0,
    audioEnergy: 'Normal'
  });

  const [speechStats, setSpeechStats] = useState<SpeechStats>({
    transcript: '',
    interimTranscript: '',
    wordCount: 0,
    fillerCount: 0,
    fillerWordsFound: []
  });

  const [liveSignal, setLiveSignal] = useState<LiveSignal | null>(null);
  const [signalHistory, setSignalHistory] = useState<LiveSignal[]>([]);
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  // Interview Mode Customization State
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Entry Level (0-1 yrs)');
  const [interviewerType, setInterviewerType] = useState('Professional');
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const [currentInterviewQuestion, setCurrentInterviewQuestion] = useState<any>({
    question: "Walk me through your favorite academic or personal project and your specific contribution.",
    reasoning: "Opening interview question for a Fresher in Software Engineer.",
    coachingHint: "Explain your project logic, your individual coding role, and what you learned."
  });
  const [interviewHistory, setInterviewHistory] = useState<Array<{ question: string; answer: string; feedback?: any }>>([]);

  // Story Mode State
  const [storyRound, setStoryRound] = useState(1);
  const [storyTopic, setStoryTopic] = useState('A unexpected crisis at work and how you handled it');
  const [storyCoaching, setStoryCoaching] = useState<any>(null);

  // Wit Mode State
  const [witTopic, setWitTopic] = useState('Explaining why software projects take longer than estimated');
  const [witResult, setWitResult] = useState<any>(null);

  // Post Session Report
  const [currentReport, setCurrentReport] = useState<SessionReport | null>(null);
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    refreshHealthCheck();
    fetchProgress();
  }, []);

  const refreshHealthCheck = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setIsGeminiConfigured(Boolean(data.geminiConfigured));
    } catch (err) {
      console.warn('Health check failed:', err);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setProgressData(data);
      }
    } catch (err) {
      console.warn('Fetch progress failed:', err);
    }
  };

  useEffect(() => {
    if (sessionState === 'active') {
      timerRef.current = setInterval(() => {
        setSessionTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState]);

  // Periodic Live Coaching Trigger
  const lastSignalTimeRef = useRef<number>(0);
  useEffect(() => {
    if (sessionState !== 'active') return;

    const fullText = (speechStats.transcript + ' ' + speechStats.interimTranscript).trim();
    if (fullText.length < 20) return;

    const now = Date.now();
    if (now - lastSignalTimeRef.current < 12000) return;

    lastSignalTimeRef.current = now;

    fetch('/api/coach/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: fullText.slice(-300), metrics: audioMetrics, mode })
    })
      .then(res => res.json())
      .then((data: LiveSignal) => {
        if (data && data.signal) {
          const sigObj: LiveSignal = { ...data, timestamp: Date.now() };
          setLiveSignal(sigObj);
          setSignalHistory(prev => [sigObj, ...prev].slice(0, 10));
        }
      })
      .catch(err => console.warn('Live signal fetch error:', err));
  }, [speechStats.transcript, speechStats.interimTranscript, sessionState, mode, audioMetrics]);

  const startSession = async (videoElement?: HTMLVideoElement): Promise<boolean> => {
    resetSessionState();
    setSessionState('active');

    const mEngine = new MediaEngine();
    mediaEngineRef.current = mEngine;
    mEngine.onAudioMetrics(metrics => {
      setAudioMetrics(metrics);
    });
    const mediaOk = await mEngine.startMedia(videoElement || (null as any));
    setIsMediaActive(mediaOk);

    const sEngine = new SpeechRecognitionEngine();
    speechEngineRef.current = sEngine;
    sEngine.onStats(stats => {
      setSpeechStats(stats);
      if (mediaEngineRef.current) {
        mediaEngineRef.current.updateTranscriptStats(stats.wordCount, stats.fillerCount);
      }
    });
    sEngine.start();

    return mediaOk;
  };

  const stopAndAnalyzeSession = async () => {
    let capturedTranscript = '';
    if (speechEngineRef.current) {
      capturedTranscript = speechEngineRef.current.getFinalTranscript();
      speechEngineRef.current.stop();
    }
    if (mediaEngineRef.current) mediaEngineRef.current.stopMedia();
    setIsMediaActive(false);

    setSessionState('analyzing');

    const finalTranscript = capturedTranscript || (speechStats.transcript + ' ' + speechStats.interimTranscript).trim();

    const actualDuration = sessionTimerSeconds || 1;
    const actualWordCount = finalTranscript.split(/\s+/).filter(Boolean).length;
    const actualWpm = Math.round((actualWordCount / actualDuration) * 60) || audioMetrics.wpm || 135;
    const actualFillers = speechStats.fillerCount;

    const payload = {
      transcript: finalTranscript || 'No speech recorded during session.',
      metrics: {
        ...audioMetrics,
        wpm: actualWpm,
        avgWpm: actualWpm,
        fillerCount: actualFillers
      },
      mode,
      durationSeconds: actualDuration,
      extraData: { interviewHistory, storyRound, difficultyLevel, interviewerType, jobRole, experienceLevel }
    };

    try {
      const res = await fetch('/api/coach/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (data && data.analysis) {
        const fullReport: SessionReport = {
          ...data.analysis,
          transcript: finalTranscript,
          durationSeconds: actualDuration,
          wordCount: actualWordCount,
          wpm: actualWpm,
          fillerCount: actualFillers
        };
        setCurrentReport(fullReport);
        if (data.progress) setProgressData(data.progress);
      } else {
        throw new Error('Analysis property missing in server response');
      }
    } catch (err) {
      console.warn('Backend session analysis failed, constructing local report fallback:', err);
      const fallbackScore = Math.max(50, Math.min(95, 80 - actualFillers * 3 + (actualWordCount > 20 ? 10 : 0)));
      const fallbackReport: SessionReport = {
        communicationPower: fallbackScore,
        scores: {
          clarity: fallbackScore,
          storytelling: Math.max(50, fallbackScore - 5),
          engagement: fallbackScore,
          delivery: Math.max(50, fallbackScore - 2),
          confidence: Math.max(50, fallbackScore + 2),
          structure: fallbackScore,
          conciseness: actualFillers > 2 ? 65 : 82,
          interviewImpact: fallbackScore
        },
        whatWorked: [
          `Maintained a vocal rate of ~${actualWpm} WPM across ${actualDuration} seconds.`,
          `Delivered ${actualWordCount} total words during the ${mode} session.`
        ],
        biggestWeakness: actualFillers > 2 
          ? `Detected ${actualFillers} filler words ("um", "uh", "like") which diluted impact.` 
          : actualWordCount < 20 
          ? "Speech duration was brief. Elaborate with additional context and examples." 
          : "Could structure your core message with a direct quantitative example.",
        oneBigUpgrade: "Pause silently when gathering thoughts instead of filling sound gap.",
        top3Improvements: [
          "State your core recommendation in sentence 1.",
          "Use a 2-second silent pause between distinct points.",
          "End with a clear, memorable closing statement."
        ],
        practiceExercise: {
          title: "The 30-Second Bullet Challenge",
          instruction: "Deliver a 30-second statement with 0 filler words and 1 concrete example."
        },
        memorabilityAssessment: {
          score: fallbackScore,
          whatListenerRemembers: "The main takeaway of your statement.",
          howToMakeUnforgettable: "Incorporate a vivid analogy or personal milestone."
        },
        transcript: finalTranscript,
        durationSeconds: actualDuration,
        wordCount: actualWordCount,
        wpm: actualWpm,
        fillerCount: actualFillers
      };
      setCurrentReport(fallbackReport);
    } finally {
      setSessionState('report');
    }
  };

  const resetSession = () => {
    resetSessionState();
    setSessionState('idle');
  };

  const resetSessionState = () => {
    if (mediaEngineRef.current) mediaEngineRef.current.stopMedia();
    if (speechEngineRef.current) speechEngineRef.current.stop();
    setIsMediaActive(false);
    setSessionTimerSeconds(0);
    setLiveSignal(null);
    setSignalHistory([]);
    setSpeechStats({
      transcript: '',
      interimTranscript: '',
      wordCount: 0,
      fillerCount: 0,
      fillerWordsFound: []
    });
  };

  const appendManualText = (text: string) => {
    if (speechEngineRef.current) {
      speechEngineRef.current.appendManualText(text);
    } else {
      setSpeechStats(prev => ({
        ...prev,
        transcript: (prev.transcript ? prev.transcript + ' ' : '') + text,
        wordCount: (prev.transcript + ' ' + text).split(/\s+/).filter(Boolean).length
      }));
    }
  };

  // Interview Functions
  const fetchNewInterviewQuestion = async (roleOverride?: string, expOverride?: string) => {
    const roleToUse = roleOverride || jobRole;
    const expToUse = expOverride || experienceLevel;

    try {
      const res = await fetch('/api/coach/interview-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: interviewHistory,
          lastAnswer: '',
          interviewerType,
          difficultyLevel,
          jobRole: roleToUse,
          experienceLevel: expToUse
        })
      });
      const data = await res.json();
      setCurrentInterviewQuestion(data);
    } catch (err) {
      console.error('Fetch new question error:', err);
    }
  };

  const submitInterviewAnswer = async (answerText: string) => {
    if (!answerText.trim()) return;

    try {
      const evalRes = await fetch('/api/coach/interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentInterviewQuestion.question,
          answer: answerText,
          audioMetrics,
          interviewerType,
          jobRole,
          experienceLevel
        })
      });
      const evalData = await evalRes.json();

      const newHistory = [
        ...interviewHistory,
        { question: currentInterviewQuestion.question, answer: answerText, feedback: evalData }
      ];
      setInterviewHistory(newHistory);

      // Get Next Adaptive Probing Question
      const nextRes = await fetch('/api/coach/interview-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory,
          lastAnswer: answerText,
          interviewerType,
          difficultyLevel,
          jobRole,
          experienceLevel
        })
      });
      const nextData = await nextRes.json();
      setCurrentInterviewQuestion(nextData);

    } catch (err) {
      console.error('Interview answer submission error:', err);
    }
  };

  // Storytelling Retelling Loop
  const submitStoryRound = async (storyText: string) => {
    try {
      const res = await fetch('/api/coach/story-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          round: storyRound,
          storyText,
          promptTopic: storyTopic
        })
      });
      const data = await res.json();
      setStoryCoaching(data);
      if (storyRound < 3) {
        setStoryRound(prev => prev + 1);
      }
    } catch (err) {
      console.error('Story coaching error:', err);
    }
  };

  // Wit Training Attempt
  const submitWitAttempt = async (attemptText: string) => {
    try {
      const res = await fetch('/api/coach/wit-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: attemptText,
          topic: witTopic
        })
      });
      const data = await res.json();
      setWitResult(data);
    } catch (err) {
      console.error('Wit attempt error:', err);
    }
  };

  return (
    <SessionContext.Provider value={{
      mode,
      setMode,
      sessionState,
      setSessionState,
      isMediaActive,
      audioMetrics,
      speechStats,
      liveSignal,
      signalHistory,
      sessionTimerSeconds,
      startSession,
      stopAndAnalyzeSession,
      resetSession,
      appendManualText,
      jobRole,
      setJobRole,
      experienceLevel,
      setExperienceLevel,
      interviewerType,
      setInterviewerType,
      difficultyLevel,
      setDifficultyLevel,
      currentInterviewQuestion,
      interviewHistory,
      submitInterviewAnswer,
      fetchNewInterviewQuestion,
      storyRound,
      storyTopic,
      setStoryTopic,
      storyCoaching,
      submitStoryRound,
      witTopic,
      setWitTopic,
      witResult,
      submitWitAttempt,
      currentReport,
      progressData,
      isGeminiConfigured,
      refreshHealthCheck
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};
