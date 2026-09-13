import React, { useState } from 'react';
import { BookOpen, Flame, Sparkles, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

const STORY_PROMPTS = [
  "A unexpected crisis at work and how you handled it",
  "The time a project completely failed and what you learned",
  "A difficult decision where every option had major trade-offs",
  "A moment when a simple observation changed your strategy",
  "The most intense argument you had with a co-founder or boss"
];

export const StorytellingMode: React.FC = () => {
  const {
    storyRound,
    storyTopic,
    setStoryTopic,
    storyCoaching,
    submitStoryRound,
    speechStats
  } = useSession();

  const [typedStory, setTypedStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const textToSubmit = typedStory.trim() || speechStats.transcript.trim();
    if (!textToSubmit) return;

    setIsSubmitting(true);
    await submitStoryRound(textToSubmit);
    setTypedStory('');
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Retelling Loop Header */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} style={{ color: '#f59e0b' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                3-ROUND STORY RETELLING LOOP
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                Information → Experience &nbsp;|&nbsp; Explanation → Scene &nbsp;|&nbsp; Lesson → Meaning
              </p>
            </div>
          </div>

          {/* Round Indicator Badges */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(r => {
              const isCurrent = storyRound === r;
              const isPassed = storyRound > r;
              return (
                <div
                  key={r}
                  style={{
                    background: isCurrent 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                      : isPassed 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid ' + (isCurrent ? '#f59e0b' : isPassed ? '#10b981' : 'rgba(255, 255, 255, 0.1)'),
                    color: isCurrent ? '#fff' : isPassed ? '#34d399' : '#6b7280',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isPassed ? <CheckCircle size={14} /> : <Flame size={14} />}
                  <span>Round {r} {r === 1 ? '(Initial)' : r === 2 ? '(Refine)' : '(Level-Up)'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Prompt Box */}
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 800, marginBottom: '6px' }}>
          Current Story Prompt
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
          <select
            value={storyTopic}
            onChange={e => setStoryTopic(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              flex: 1,
              outline: 'none'
            }}
          >
            {STORY_PROMPTS.map((p, i) => (
              <option key={i} value={p} style={{ background: '#0f172a' }}>{p}</option>
            ))}
          </select>
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            rows={3}
            value={typedStory}
            onChange={e => setTypedStory(e.target.value)}
            placeholder={`Tell your Round ${storyRound} story... Focus on a person, a moment, a decision, and conflict.`}
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              alignSelf: 'flex-end',
              padding: '12px 20px'
            }}
          >
            {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
            <span>Submit Round {storyRound}</span>
          </button>
        </div>
      </div>

      {/* Story Retelling Feedback */}
      {storyCoaching && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#f59e0b' }} />
              Round {storyCoaching.round} Story Feedback & Retell Challenge
            </h4>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24' }}>
              Score: {storyCoaching.score} / 100
            </span>
          </div>

          {/* Checklist */}
          {storyCoaching.elementChecklist && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {Object.entries(storyCoaching.elementChecklist).map(([key, val]) => (
                <div key={key} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#e2e8f0'
                }}>
                  <span style={{ textTransform: 'capitalize', color: '#9ca3af' }}>{key}: </span>
                  <strong style={{ color: val === 'Strong' || val === 'Clear' || val === 'High' ? '#34d399' : '#f87171' }}>
                    {String(val)}
                  </strong>
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '0.88rem'
          }}>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '6px' }}>
              🎯 Retell Challenge for Round {storyRound}:
            </strong>
            <p style={{ color: '#fff', marginBottom: '8px', fontWeight: 600 }}>
              {storyCoaching.retellChallenge}
            </p>
            <ul style={{ paddingLeft: '18px', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {storyCoaching.targetedImprovements?.map((imp: string, idx: number) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
