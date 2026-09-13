import React, { useRef, useEffect } from 'react';
import { Camera, Mic, Play, Square, Sparkles, Volume2, Clock, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { InterviewMode } from '../Modes/InterviewMode';
import { StorytellingMode } from '../Modes/StorytellingMode';
import { WitMode } from '../Modes/WitMode';
import { PublicSpeakingMode } from '../Modes/PublicSpeakingMode';
import { ConversationMode } from '../Modes/ConversationMode';
import { AudienceSimulationMode } from '../Modes/AudienceSimulationMode';

export const SessionHUD: React.FC = () => {
  const {
    mode,
    sessionState,
    isMediaActive,
    audioMetrics,
    speechStats,
    liveSignal,
    signalHistory,
    sessionTimerSeconds,
    startSession,
    stopAndAnalyzeSession,
    resetSession,
    appendManualText
  } = useSession();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const [manualInput, setManualInput] = React.useState('');

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [speechStats.transcript, speechStats.interimTranscript]);

  const handleStart = async () => {
    await startSession(videoRef.current || undefined);
  };

  const handleSendManual = () => {
    if (!manualInput.trim()) return;
    appendManualText(manualInput.trim());
    setManualInput('');
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderActiveModeComponent = () => {
    switch (mode) {
      case 'Interview':
        return <InterviewMode />;
      case 'Storytelling':
        return <StorytellingMode />;
      case 'Wit Training':
        return <WitMode />;
      case 'Public Speaking':
        return <PublicSpeakingMode />;
      case 'Conversation':
        return <ConversationMode />;
      case 'Audience Simulation':
        return <AudienceSimulationMode />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Session Control Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>
            Mode: <span style={{ color: '#fff' }}>{mode}</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
            <Clock size={15} />
            <span>{formatTimer(sessionTimerSeconds)}</span>
          </div>
        </div>

        {/* Start / Stop Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {sessionState === 'idle' && (
            <button onClick={handleStart} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              <Play size={18} />
              <span>Start Live Coaching</span>
            </button>
          )}

          {sessionState === 'active' && (
            <button onClick={stopAndAnalyzeSession} className="btn-danger" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              <Square size={18} />
              <span>End Session & Analyze</span>
            </button>
          )}

          {sessionState === 'analyzing' && (
            <div style={{ color: '#818cf8', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles className="animate-spin" size={18} />
              <span>Gemini AI Analyzing Session...</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Video & HUD Overlay, Right Mode Controller */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Video Preview & Live HUD Signal Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Camera Frame Container */}
          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', height: '360px', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Mirror preview
                opacity: isMediaActive ? 1 : 0.2
              }}
            />

            {!isMediaActive && (
              <div style={{ position: 'absolute', textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                <Camera size={48} style={{ margin: '0 auto 12px auto', color: '#4b5563' }} />
                <h4 style={{ color: '#e5e7eb', fontSize: '1.05rem', fontWeight: 700 }}>Camera & Microphone Ready</h4>
                <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Click "Start Live Coaching" to activate live audio-visual feedback.</p>
              </div>
            )}

            {/* FLOATING LIVE HUD SIGNAL BADGE */}
            {liveSignal && (
              <div className="animate-signal" style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: liveSignal.type === 'positive' 
                  ? 'rgba(16, 185, 129, 0.95)' 
                  : liveSignal.type === 'insight' 
                  ? 'rgba(99, 102, 241, 0.95)' 
                  : 'rgba(245, 158, 11, 0.95)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 20
              }}>
                <Sparkles size={20} />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {liveSignal.signal}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, opacity: 0.9 }}>
                    {liveSignal.message}
                  </div>
                </div>
              </div>
            )}

            {/* Audio Waveform Indicator Overlay */}
            {isMediaActive && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)'
              }}>
                <Volume2 size={16} style={{ color: audioMetrics.volumeRms > 15 ? '#34d399' : '#9ca3af' }} />
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="audio-bar"
                      style={{
                        height: `${Math.max(4, (audioMetrics.volumeRms / 100) * 20 * (i % 2 === 0 ? 1.5 : 0.8))}px`,
                        animationPlayState: audioMetrics.volumeRms > 10 ? 'running' : 'paused'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Pace (WPM)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: audioMetrics.wpm > 170 ? '#f59e0b' : '#38bdf8' }}>{audioMetrics.wpm}</div>
            </div>
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Fillers</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: speechStats.fillerCount > 3 ? '#f43f5e' : '#34d399' }}>{speechStats.fillerCount}</div>
            </div>
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Words</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#a5b4fc' }}>{speechStats.wordCount}</div>
            </div>
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Pauses</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#67e8f9' }}>{audioMetrics.pauseCount}</div>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div className="glass-panel" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>
                Live Session Transcript
              </span>
              {speechStats.fillerWordsFound.length > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#f87171' }}>
                  Fillers detected: {speechStats.fillerWordsFound.join(', ')}
                </span>
              )}
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              padding: '12px',
              height: '140px',
              overflowY: 'auto',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: '#e5e7eb'
            }}>
              {speechStats.transcript || speechStats.interimTranscript ? (
                <span>
                  {speechStats.transcript}
                  <span style={{ color: '#38bdf8', fontStyle: 'italic' }}> {speechStats.interimTranscript}</span>
                </span>
              ) : (
                <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  Transcript will stream here live as you speak...
                </span>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Manual text input fallback */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendManual()}
                placeholder="Or type text to add to transcript..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
              <button onClick={handleSendManual} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mode-Specific Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {renderActiveModeComponent()}
        </div>
      </div>
    </div>
  );
};
