import React, { useState } from 'react';
import { Smile, Sparkles, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

const WIT_TECHNIQUES = [
  { name: 'Observation', desc: 'Noticing the humorous truth about a situation' },
  { name: 'Contrast', desc: 'Juxtaposing high expectations with mundane reality' },
  { name: 'Analogy', desc: 'Comparing complex chaos to something familiar & vivid' },
  { name: 'Understatement', desc: 'Downplaying massive impact for comedic precision' },
  { name: 'Callbacks', desc: 'Referencing a point made earlier for emotional payoff' }
];

export const WitMode: React.FC = () => {
  const { witTopic, setWitTopic, witResult, submitWitAttempt, speechStats } = useSession();
  const [typedWit, setTypedWit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const textToSubmit = typedWit.trim() || speechStats.transcript.trim();
    if (!textToSubmit) return;

    setIsSubmitting(true);
    await submitWitAttempt(textToSubmit);
    setTypedWit('');
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Smile size={22} style={{ color: '#06b6d4' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              WIT & CONTEXTUAL HUMOR CULTIVATION
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              Emotional Rhythm: DEPTH → RELIEF → DEPTH → PAYOFF
            </p>
          </div>
        </div>

        {/* Technique pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {WIT_TECHNIQUES.map((t, idx) => (
            <div key={idx} style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#67e8f9'
            }}>
              <strong>{t.name}:</strong> {t.desc}
            </div>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 800, marginBottom: '6px', display: 'block' }}>
          Practice Topic / Conversation Context
        </label>
        <input
          type="text"
          value={witTopic}
          onChange={e => setWitTopic(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '0.9rem',
            marginBottom: '12px'
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            rows={2}
            value={typedWit}
            onChange={e => setTypedWit(e.target.value)}
            placeholder="Deliver your witty phrasing or observation..."
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              color: '#fff',
              fontSize: '0.9rem',
              resize: 'none'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              alignSelf: 'flex-end',
              padding: '10px 18px'
            }}
          >
            {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
            <span>Evaluate Wit</span>
          </button>
        </div>
      </div>

      {/* Wit Result */}
      {witResult && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#06b6d4' }} />
              Wit Analysis
            </h4>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#22d3ee' }}>
              Wit Score: {witResult.witScore} / 100
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Technique Identified:</strong> {witResult.techniqueIdentified}</div>
            <div><strong>Feedback:</strong> {witResult.feedback}</div>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <strong>🚀 Wit Sharpen Upgrade:</strong> {witResult.witUpgrade}
            </div>
            {!witResult.isAppropriate && (
              <div style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                <span>Caution: Humor may come across as forced or distracting in formal settings.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
