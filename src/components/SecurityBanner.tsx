import React from 'react';
import { ShieldAlert, Terminal, CheckCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const SecurityBanner: React.FC = () => {
  const { isGeminiConfigured } = useSession();

  if (isGeminiConfigured) {
    return null;
  }

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '12px',
      padding: '16px 20px',
      margin: '16px 24px 0 24px',
      color: '#fca5a5',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px'
    }}>
      <ShieldAlert size={28} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.05rem', color: '#fee2e2', fontWeight: 700, marginBottom: '4px' }}>
          SECURITY REQUIREMENT: GEMINI_API_KEY Missing
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#fca5a5', marginBottom: '8px', lineHeight: 1.4 }}>
          The backend API requires a server-side <code>GEMINI_API_KEY</code> environment variable. The browser never receives or exposes your secret key.
        </p>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '10px 14px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Terminal size={16} style={{ color: '#818cf8' }} />
          <span>1. Create a <code>.env</code> file in project root &nbsp;&nbsp;|&nbsp;&nbsp; 2. Add: <code>GEMINI_API_KEY=your_actual_key</code></span>
        </div>
      </div>
    </div>
  );
};
