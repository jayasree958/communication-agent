import React from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

export const ConversationMode: React.FC = () => {
  const { speechStats } = useSession();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #818cf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Users size={22} style={{ color: '#818cf8' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              REALISTIC CONVERSATION COACHING
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              Listening • Responsiveness • Curiosity • EQ • Graceful Disagreement
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.5 }}>
          Speak naturally as if talking to a colleague, partner, or executive.
          The AI coach will analyze how well you listen, ask open questions, build on other statements, and recover from awkward moments.
        </div>
      </div>
    </div>
  );
};
