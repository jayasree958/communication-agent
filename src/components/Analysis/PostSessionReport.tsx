import React from 'react';
import { Trophy, CheckCircle2, AlertTriangle, ArrowUpRight, Dumbbell, Sparkles, RefreshCw, Eye, MicOff } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

export const PostSessionReport: React.FC = () => {
  const { currentReport, resetSession, mode } = useSession();

  if (!currentReport || currentReport.isEmptySession) {
    return (
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '60px auto', padding: '40px 30px', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <MicOff size={32} style={{ color: '#fbbf24' }} />
        </div>
        
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Not Enough Speech Captured</h3>
        <p style={{ color: '#9ca3af', marginTop: '10px', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px', margin: '10px auto 0 auto' }}>
          {currentReport?.emptyMessage || "IMPACT requires live speech audio to evaluate your communication power, structure, WPM, fillers, and storytelling."}
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          textAlign: 'left',
          fontSize: '0.88rem',
          color: '#d1d5db',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#818cf8', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            💡 Tips for a Great Session:
          </strong>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Ensure microphone permissions are enabled in your browser bar.</li>
            <li>Speak continuously into your microphone for at least 10–30 seconds.</li>
            <li>You can also type text in the live transcript box if your microphone is unavailable.</li>
          </ul>
        </div>

        <button onClick={resetSession} className="btn-primary" style={{ marginTop: '28px', padding: '12px 32px', fontSize: '0.95rem' }}>
          <RefreshCw size={18} />
          <span>Start New Coaching Session</span>
        </button>
      </div>
    );
  }

  const score = currentReport.communicationPower || 75;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DEEP POST-SESSION ANALYSIS • {mode}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
            Session Performance Breakdown
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '2px' }}>
            Calculated from real session transcript and audio-visual delivery metrics.
          </p>
        </div>

        {/* Communication Power Gauge */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '2px solid rgba(99, 102, 241, 0.5)',
          borderRadius: '20px',
          padding: '16px 28px',
          textAlign: 'center',
          boxShadow: '0 0 24px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            COMMUNICATION POWER
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #a5b4fc, #6366f1, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {score} <span style={{ fontSize: '1.2rem', color: '#6b7280' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* 12 Metric Sub-score Grid */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} style={{ color: '#fbbf24' }} />
          Multi-Dimensional Performance Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {Object.entries(currentReport.scores || {}).map(([key, val]) => {
            const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#d1d5db', fontWeight: 600 }}>{formattedName}</span>
                  <span style={{ fontWeight: 800, color: val >= 80 ? '#34d399' : val >= 68 ? '#38bdf8' : '#f87171' }}>
                    {val}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${val}%`,
                    background: val >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : val >= 68 ? 'linear-gradient(90deg, #6366f1, #38bdf8)' : 'linear-gradient(90deg, #f43f5e, #fbbf24)',
                    borderRadius: '3px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Core Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* WHAT WORKED */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            WHAT WORKED (Strongest Behaviors)
          </h4>
          <ul style={{ paddingLeft: '18px', color: '#e5e7eb', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentReport.whatWorked?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* BIGGEST WEAKNESS */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f43f5e' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f43f5e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            BIGGEST WEAKNESS (Highest Impact Problem)
          </h4>
          <p style={{ color: '#fee2e2', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {currentReport.biggestWeakness}
          </p>
        </div>

        {/* ONE BIG UPGRADE */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#818cf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={18} />
            ONE BIG UPGRADE (Single Highest Leverage Change)
          </h4>
          <p style={{ color: '#e0e7ff', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 600 }}>
            {currentReport.oneBigUpgrade}
          </p>
        </div>
      </div>

      {/* TOP 3 IMPROVEMENTS & PRACTICE EXERCISE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* TOP 3 IMPROVEMENTS */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} />
            TOP 3 ACTIONABLE IMPROVEMENTS
          </h4>
          <ol style={{ paddingLeft: '20px', color: '#e5e7eb', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentReport.top3Improvements?.map((imp, idx) => (
              <li key={idx}><strong>Step {idx + 1}:</strong> {imp}</li>
            ))}
          </ol>
        </div>

        {/* PERSONALIZED PRACTICE EXERCISE */}
        {currentReport.practiceExercise && (
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dumbbell size={18} />
              TARGETED PRACTICE EXERCISE: {currentReport.practiceExercise.title}
            </h4>
            <p style={{ color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
              {currentReport.practiceExercise.instruction}
            </p>
          </div>
        )}
      </div>

      {/* Session Metrics Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>{currentReport.durationSeconds || 0}s</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Total Words</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a5b4fc' }}>{currentReport.wordCount || 0}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Pace (WPM)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>{currentReport.wpm || 135}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Filler Words</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: (currentReport.fillerCount || 0) > 3 ? '#f43f5e' : '#34d399' }}>{currentReport.fillerCount || 0}</div>
        </div>
      </div>

      {/* MEMORABILITY AUDIT */}
      {currentReport.memorabilityAssessment && (
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#22d3ee', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} />
            AUDIENCE MEMORABILITY ASSESSMENT
          </h4>
          <div style={{ fontSize: '0.88rem', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><strong>What the listener remembers tomorrow:</strong> {currentReport.memorabilityAssessment.whatListenerRemembers}</div>
            <div><strong>How to make it unforgettable:</strong> {currentReport.memorabilityAssessment.howToMakeUnforgettable}</div>
          </div>
        </div>
      )}

      {/* Actual Analyzed Session Transcript */}
      {currentReport.transcript && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#818cf8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Analyzed Session Transcript
          </h4>
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: '#e5e7eb',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            "{currentReport.transcript}"
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '10px 0 30px 0' }}>
        <button onClick={resetSession} className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
          <RefreshCw size={18} />
          <span>Start Another Coaching Session</span>
        </button>
      </div>
    </div>
  );
};
