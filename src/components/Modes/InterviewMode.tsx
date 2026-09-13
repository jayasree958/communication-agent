import React, { useState } from 'react';
import { UserCheck, Briefcase, GraduationCap, Sparkles, Award, RefreshCw, Send, Sliders } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

const INTERVIEWER_TYPES = [
  { id: 'Friendly', name: 'Friendly', desc: 'Warm, encouraging, but asks smart follow-ups.' },
  { id: 'Professional', name: 'Professional', desc: 'Structured, polished, metric & impact-focused.' },
  { id: 'Behavioral', name: 'Behavioral', desc: 'STAR-oriented, probes past decisions & conflicts.' },
  { id: 'Technical', name: 'Technical', desc: 'Deep dive into reasoning, logic & architecture.' },
  { id: 'Skeptical', name: 'Skeptical', desc: 'Challenges assumptions & probes for exaggerations.' },
  { id: 'Executive', name: 'Executive', desc: 'High-level ROI, strategic vision & leadership.' },
  { id: 'Stress', name: 'Stress Interviewer', desc: 'Fast-paced, high pressure, pushes on weaknesses.' }
];

const STANDARD_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist / AI Engineer',
  'Sales & Business Dev',
  'Marketing & Growth Manager',
  'Financial Analyst',
  'Human Resources / Recruiter',
  'UI/UX Designer',
  'DevOps / Cloud Architect',
  'Cybersecurity Specialist',
  'Operations & Supply Chain Manager',
  'Strategy & Management Consultant',
  'Customer Success Lead',
  'Project Manager / Scrum Master',
  'Custom Role'
];

const EXPERIENCE_LEVELS = [
  { id: 'Fresher / Entry Level (0-1 yrs)', label: '🎓 Fresher / Entry Level (0-1 yrs)', desc: 'Focuses on fundamentals, academic/personal projects, internships, learning agility, and core logic.' },
  { id: 'Mid-Level Professional (2-5 yrs)', label: '💼 Mid-Level (2-5 yrs)', desc: 'Focuses on practical project execution, domain ownership, collaboration, and metric achievements.' },
  { id: 'Senior Specialist / Team Lead (5-8 yrs)', label: '🚀 Senior Specialist / Lead (5-8 yrs)', desc: 'Focuses on deep domain expertise, system trade-offs, mentoring, and risk management.' },
  { id: 'Manager / Director (8-12 yrs)', label: '👔 Manager / Director (8-12 yrs)', desc: 'Focuses on team leadership, resource allocation, cross-functional alignment, and project execution.' },
  { id: 'Executive / VP / C-Suite (12+ yrs)', label: '👑 Executive / VP / C-Suite (12+ yrs)', desc: 'Focuses on P&L responsibility, strategic vision, company culture, ROI, and organizational transformation.' }
];

export const InterviewMode: React.FC = () => {
  const {
    jobRole,
    setJobRole,
    experienceLevel,
    setExperienceLevel,
    interviewerType,
    setInterviewerType,
    difficultyLevel,
    setDifficultyLevel,
    currentInterviewQuestion,
    interviewHistory,
    submitInterviewAnswer,
    fetchNewInterviewQuestion,
    speechStats,
    sessionState
  } = useSession();

  const [customRoleInput, setCustomRoleInput] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingQuestion, setIsRefreshingQuestion] = useState(false);

  const handleRoleChange = (role: string) => {
    if (role === 'Custom Role') {
      setJobRole('Custom Role');
    } else {
      setJobRole(role);
      fetchNewInterviewQuestion(role, experienceLevel);
    }
  };

  const handleCustomRoleSubmit = () => {
    if (customRoleInput.trim()) {
      setJobRole(customRoleInput.trim());
      fetchNewInterviewQuestion(customRoleInput.trim(), experienceLevel);
    }
  };

  const handleExpChange = (level: string) => {
    setExperienceLevel(level);
    fetchNewInterviewQuestion(jobRole, level);
  };

  const handleGenerateNewQuestion = async () => {
    setIsRefreshingQuestion(true);
    await fetchNewInterviewQuestion();
    setIsRefreshingQuestion(false);
  };

  const handleSubmit = async () => {
    const textToSubmit = typedAnswer.trim() || speechStats.transcript.trim();
    if (!textToSubmit) return;

    setIsSubmitting(true);
    await submitInterviewAnswer(textToSubmit);
    setTypedAnswer('');
    setIsSubmitting(false);
  };

  const latestFeedback = interviewHistory.length > 0 ? interviewHistory[interviewHistory.length - 1].feedback : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Role & Experience Level Customization Panel */}
      <div className="glass-panel" style={{ padding: '18px 22px', borderLeft: '4px solid #818cf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sliders size={18} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Interview Customization: Target Role & Candidate Level
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* 1. Target Role Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Briefcase size={14} style={{ color: '#38bdf8' }} />
              Target Job Role
            </label>
            <select
              value={STANDARD_ROLES.includes(jobRole) ? jobRole : 'Custom Role'}
              onChange={e => handleRoleChange(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              {STANDARD_ROLES.map((r, i) => (
                <option key={i} value={r} style={{ background: '#0f172a' }}>{r}</option>
              ))}
            </select>

            {jobRole === 'Custom Role' && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={e => setCustomRoleInput(e.target.value)}
                  placeholder="Enter specific role title..."
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                />
                <button
                  onClick={handleCustomRoleSubmit}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  Set Role
                </button>
              </div>
            )}
          </div>

          {/* 2. Candidate Stage Selector (Fresher vs Experienced) */}
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <GraduationCap size={14} style={{ color: '#34d399' }} />
              Experience Level (Fresher vs Professional)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {EXPERIENCE_LEVELS.map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => handleExpChange(lvl.id)}
                  style={{
                    background: experienceLevel === lvl.id ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid ' + (experienceLevel === lvl.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)'),
                    color: experienceLevel === lvl.id ? '#fff' : '#9ca3af',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: experienceLevel === lvl.id ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={lvl.desc}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interviewer Personality & Difficulty Level Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Personality Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.05em' }}>
              Interviewer Personality Style
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {INTERVIEWER_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setInterviewerType(t.id)}
                  style={{
                    background: interviewerType === t.id ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                    color: interviewerType === t.id ? '#fff' : '#9ca3af',
                    border: '1px solid ' + (interviewerType === t.id ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'),
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={t.desc}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Slider */}
          <div style={{ minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>
                Difficulty Level
              </label>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
                L{difficultyLevel} / 7
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={difficultyLevel}
              onChange={e => setDifficultyLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b7280' }}>
              <span>L1 Basic</span>
              <span>L4 Behavioral</span>
              <span>L7 Executive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Question Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderLeft: '4px solid #6366f1',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(18, 24, 38, 0.7) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Adaptive Interviewer • <span style={{ color: '#fff' }}>{jobRole}</span> ({experienceLevel}) • {interviewerType} Level {difficultyLevel}
            </span>
          </div>

          <button
            onClick={handleGenerateNewQuestion}
            disabled={isRefreshingQuestion}
            className="btn-secondary"
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            {isRefreshingQuestion ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
            <span>New Question</span>
          </button>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.4 }}>
          "{currentInterviewQuestion.question}"
        </h3>

        {currentInterviewQuestion.coachingHint && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} style={{ color: '#38bdf8' }} />
            <span><strong>Coach Hint:</strong> {currentInterviewQuestion.coachingHint}</span>
          </div>
        )}

        {/* Input / Respond action */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <textarea
            rows={2}
            value={typedAnswer}
            onChange={e => setTypedAnswer(e.target.value)}
            placeholder={sessionState === 'active' ? "Speaking live... (Or type manually here)" : `Type your response for a ${experienceLevel} ${jobRole} interview...`}
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
            style={{ alignSelf: 'flex-end', padding: '10px 18px' }}
          >
            {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
            <span>Submit Answer</span>
          </button>
        </div>
      </div>

      {/* Dual Evaluation Card (WHAT + HOW) */}
      {latestFeedback && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#34d399' }} />
              Dual Interview Evaluation ({jobRole} • {experienceLevel})
            </h4>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #34d399, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Score: {latestFeedback.overallScore} / 100
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* WHAT YOU SAID */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '14px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>
                  1. WHAT YOU SAID ({jobRole} Content)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#818cf8' }}>
                  {latestFeedback.whatYouSaid?.score}/100
                </span>
              </div>
              <ul style={{ fontSize: '0.82rem', color: '#d1d5db', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {latestFeedback.whatYouSaid?.strengths?.map((s: string, i: number) => (
                  <li key={i} style={{ color: '#6ee7b7' }}>{s}</li>
                ))}
                {latestFeedback.whatYouSaid?.weaknesses?.map((w: string, i: number) => (
                  <li key={i} style={{ color: '#fca5a5' }}>{w}</li>
                ))}
              </ul>
            </div>

            {/* HOW YOU SAID IT */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '14px',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  2. HOW YOU SAID IT (Delivery)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                  {latestFeedback.howYouSaidIt?.score}/100
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Confidence:</strong> {latestFeedback.howYouSaidIt?.confidence}</div>
                <div><strong>Pace & Fillers:</strong> {latestFeedback.howYouSaidIt?.paceRating}</div>
                <div><strong>Feedback:</strong> {latestFeedback.howYouSaidIt?.deliveryFeedback}</div>
              </div>
            </div>
          </div>

          {/* Coaching & STAR / Framing Suggestion */}
          {latestFeedback.coachingAction && (
            <div style={{
              marginTop: '16px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: '4px' }}>
                💡 Actionable Upgrade for {experienceLevel} in {jobRole}:
              </div>
              <div style={{ color: '#e0e7ff' }}>
                {latestFeedback.coachingAction.directionToImprove}
              </div>
              {latestFeedback.coachingAction.exampleFraming && (
                <div style={{ color: '#93c5fd', marginTop: '6px', fontSize: '0.8rem' }}>
                  <strong>Suggested Response Framing:</strong> {latestFeedback.coachingAction.exampleFraming}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
