import React from 'react';
import { Mic, Eye, Activity, Award, HelpCircle } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

export const PublicSpeakingMode: React.FC = () => {
  const { audioMetrics } = useSession();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Mic size={22} style={{ color: '#10b981' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              PUBLIC SPEAKING & DELIVERY COMMAND
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              Real-time Voice & Body Language Analysis + Memorability Audit
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Vocal Energy</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{audioMetrics.audioEnergy}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Speaking Rate</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{audioMetrics.wpm} WPM</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Pitch Variation</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a5b4fc' }}>{audioMetrics.pitchVariance > 20 ? 'Dynamic' : 'Steady'}</div>
          </div>
        </div>
      </div>

      {/* Memorability Test Prompt */}
      <div className="glass-panel" style={{ padding: '18px', background: 'rgba(16, 185, 129, 0.08)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <HelpCircle size={18} />
          THE MEMORABILITY TEST
        </h4>
        <p style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600 }}>
          "What will your audience remember 24 hours after your speech?"
        </p>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
          If nothing stands out, introduce a striking scene, unexpected contrast, or bold takeaway phrase.
        </p>
      </div>
    </div>
  );
};
