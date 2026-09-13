import React, { useState } from 'react';
import { Users, AlertCircle, ThumbsUp, HelpCircle, Flame } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

const AUDIENCE_TYPES = [
  { name: 'Skeptical Audience', icon: AlertCircle, color: '#f87171', reaction: '"Can you back that up with real data?"' },
  { name: 'Confused Audience', icon: HelpCircle, color: '#fbbf24', reaction: '"Wait, what does that technical acronym mean?"' },
  { name: 'Distracted Audience', icon: Flame, color: '#a855f7', reaction: '"(Audience checking phones... grab attention with a hook!)"' },
  { name: 'Enthusiastic Audience', icon: ThumbsUp, color: '#34d399', reaction: '"Love that point! How does it scale?"' }
];

export const AudienceSimulationMode: React.FC = () => {
  const [selectedAudience, setSelectedAudience] = useState(0);

  const active = AUDIENCE_TYPES[selectedAudience];
  const Icon = active.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 800, marginBottom: '8px' }}>
          Select Simulated Audience Persona
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {AUDIENCE_TYPES.map((a, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAudience(idx)}
              style={{
                background: selectedAudience === idx ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid ' + (selectedAudience === idx ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'),
                color: selectedAudience === idx ? '#fff' : '#9ca3af',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <a.icon size={14} style={{ color: a.color }} />
              <span>{a.name}</span>
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: `1px solid ${active.color}`,
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Icon size={24} style={{ color: active.color }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: active.color, textTransform: 'uppercase' }}>
              Live Audience Reaction
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontStyle: 'italic' }}>
              {active.reaction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
