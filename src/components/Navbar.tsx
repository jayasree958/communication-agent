import React from 'react';
import { Zap, Target, TrendingUp, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { useSession, TrainingMode } from '../context/SessionContext';

interface NavbarProps {
  currentTab: 'session' | 'progress';
  setCurrentTab: (tab: 'session' | 'progress') => void;
}

const MODES: TrainingMode[] = [
  'Interview',
  'Storytelling',
  'Public Speaking',
  'Conversation',
  'Wit Training',
  'Free Speaking',
  'Rapid Response',
  'Audience Simulation'
];

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { mode, setMode, isGeminiConfigured, sessionState } = useSession();

  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
          }}>
            <Zap size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>
                IMPACT
              </h1>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '20px',
                letterSpacing: '0.05em'
              }}>
                AI COACH
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
              MAKE YOURSELF IMPOSSIBLE TO IGNORE
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        {currentTab === 'session' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '4px' }}>
            {MODES.map(m => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  disabled={sessionState === 'active'}
                  onClick={() => setMode(m)}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isActive 
                      ? '1px solid #6366f1' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#fff' : '#9ca3af',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: sessionState === 'active' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Navigation & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Security Status Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isGeminiConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: isGeminiConfigured ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: isGeminiConfigured ? '#34d399' : '#f87171'
          }}>
            {isGeminiConfigured ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>{isGeminiConfigured ? 'Gemini Secure API' : 'API Key Setup Needed'}</span>
          </div>

          {/* View Tab Buttons */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setCurrentTab('session')}
              style={{
                background: currentTab === 'session' ? '#6366f1' : 'transparent',
                color: currentTab === 'session' ? '#fff' : '#9ca3af',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Target size={15} />
              <span>Session HUD</span>
            </button>
            <button
              onClick={() => setCurrentTab('progress')}
              style={{
                background: currentTab === 'progress' ? '#6366f1' : 'transparent',
                color: currentTab === 'progress' ? '#fff' : '#9ca3af',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <TrendingUp size={15} />
              <span>Progress & Memory</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
