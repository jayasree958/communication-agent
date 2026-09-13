import React from 'react';
import { TrendingUp, Brain, Target, ShieldAlert, Award, Calendar, ChevronRight } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

export const ProgressDashboard: React.FC = () => {
  const { progressData } = useSession();

  const sessions = progressData?.sessions || [];
  const errorMemory = progressData?.errorMemory || {
    fillerWords: 4,
    fastSpeaking: 2,
    weakHooks: 1,
    rambling: 3,
    lackOfEvidence: 5,
    monotoneDelivery: 1
  };

  const skillsProgress = progressData?.skillsProgress || [
    { date: 'Sess 1', power: 65, storytelling: 60, interview: 62, clarity: 68 },
    { date: 'Sess 2', power: 71, storytelling: 66, interview: 70, clarity: 74 },
    { date: 'Sess 3', power: 78, storytelling: 74, interview: 76, clarity: 81 },
    { date: 'Sess 4', power: 84, storytelling: 82, interview: 83, clarity: 86 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PERSONAL ERROR MEMORY & ANALYTICS
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
            Long-Term Communication Growth
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
            Tracks recurring weaknesses across sessions and measures trajectory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Total Sessions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{sessions.length || 4}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Latest Power Score</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>
              {skillsProgress[skillsProgress.length - 1]?.power || 84}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Personal Error Memory & Skills Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* PERSONAL ERROR MEMORY */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={20} style={{ color: '#f43f5e' }} />
            Personal Error Memory (Tracked Weaknesses)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '16px' }}>
            Identifies recurring communication traps to generate adaptive retraining.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(errorMemory).map(([errKey, count]) => {
              const numCount = Number(count);
              const label = errKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={errKey} style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.88rem', color: '#e5e7eb', fontWeight: 600 }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: numCount >= 4 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid ' + (numCount >= 4 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'),
                      color: numCount >= 4 ? '#f87171' : '#fbbf24',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      Flagged {numCount}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SKILLS TRAJECTORY CHART */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: '#38bdf8' }} />
            Communication Growth Trajectory
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skillsProgress.map((item: any, idx: number) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }}>{item.date}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#34d399' }}>Power: {item.power}/100</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <div>Storytelling: <strong style={{ color: '#fbbf24' }}>{item.storytelling}</strong></div>
                  <div>Interview: <strong style={{ color: '#38bdf8' }}>{item.interview}</strong></div>
                  <div>Clarity: <strong style={{ color: '#a5b4fc' }}>{item.clarity}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SESSION HISTORY LIST */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} style={{ color: '#a5b4fc' }} />
          Recent Coaching Sessions
        </h3>

        {sessions.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No saved sessions yet. Run a live session to record history.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((s: any) => (
              <div key={s.id} style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px 16px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{s.mode} Session</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {new Date(s.timestamp).toLocaleString()} • Upgrade: {s.oneBigUpgrade || s.biggestWeakness}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399' }}>
                    {s.communicationPower}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
