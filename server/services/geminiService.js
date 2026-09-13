import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_actual_gemini_api_key_here')) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Fallback rule-based live signal when API key is unconfigured or low-latency local check is needed
export function calculateLocalLiveSignal(transcript, metrics = {}) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = metrics.wpm || 0;
  const fillers = metrics.fillerCount || 0;
  const fillerRatio = wordCount > 0 ? fillers / wordCount : 0;

  if (fillerRatio > 0.10) {
    return { signal: '🟡 FILLER OVERLOAD', message: 'Too many filler words. Take a clean pause.', type: 'warning' };
  }
  if (wpm > 175) {
    return { signal: '🟡 SLOW DOWN', message: 'Speaking rate is very fast. Give your ideas space to land.', type: 'warning' };
  }
  if (wpm < 80 && wordCount > 15) {
    return { signal: '🟡 PICK UP PACE', message: 'Energy is dropping. Pick up momentum.', type: 'warning' };
  }
  if (wordCount > 120 && !transcript.includes('?') && !transcript.includes('.')) {
    return { signal: '🟡 TOO LONG', message: 'Long continuous sentence. Wrap up this point.', type: 'warning' };
  }

  const storyKeywords = ['remember', 'happened', 'one day', 'suddenly', 'realized', 'built', 'failed', 'first time'];
  if (storyKeywords.some(kw => transcript.toLowerCase().includes(kw))) {
    return { signal: '💡 STORY OPPORTUNITY', message: 'Great story setup. Describe the scene or conflict.', type: 'insight' };
  }

  return { signal: '🟢 STRONG FLOW', message: 'Pace and tone are solid. Keep going.', type: 'positive' };
}

/**
 * Generate lightweight live coaching feedback (minimal interruptions rule)
 */
export async function generateLiveSignal(transcript, metrics, mode) {
  const ai = getGenAIClient();
  if (!ai) {
    return calculateLocalLiveSignal(transcript, metrics);
  }

  const prompt = `
You are the Live Communication Coach for an application whose mission is "MAKE THE USER IMPOSSIBLE TO IGNORE".
Mode: ${mode}
Recent user speech segment: "${transcript}"
Vocal Metrics: WPM=${metrics.wpm || 'N/A'}, Volume Variance=${metrics.volumeVariance || 'Normal'}, Filler Words=${metrics.fillerCount || 0}

Golden Rule: DO NOT CONSTANTLY INTERRUPT. Only provide live feedback when it has high leverage value.

Available Visual Signals:
- 🟢 STRONG (great emphasis, hook, or rhythm)
- 🟡 SLOW DOWN (speaking too fast)
- 🟡 CLARIFY (confusing or overly complex idea)
- 🟡 TOO LONG (rambling or repeating)
- 🟡 FILLER (excessive um/uh/like)
- 🔴 OFF TRACK (deviated from topic or question)
- 💡 STORY (opportunity to paint a vivid picture/scene)
- 💡 WIT (opportunity for playful contrast or callback)
- 🎯 EMPHASIZE (key idea delivered well, pause on it)

Output strictly valid JSON:
{
  "signal": "ONE_OF_THE_BADGES_ABOVE",
  "message": "Short 3-6 word actionable live cue",
  "type": "positive" | "warning" | "insight"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Live Signal Error:', err.message);
    return calculateLocalLiveSignal(transcript, metrics);
  }
}



/**
 * Adaptive Interview Question Generator
 * Role-tailored & Experience-level tailored (Fresher vs Professional)
 */
export async function generateAdaptiveInterviewQuestion(
  history,
  lastAnswer,
  interviewerType = 'Professional',
  difficultyLevel = 1,
  jobRole = 'Software Engineer',
  experienceLevel = 'Fresher'
) {
  const ai = getGenAIClient();
  if (!ai) {
    return generateFallbackInterviewQuestion(lastAnswer, interviewerType, difficultyLevel, jobRole, experienceLevel);
  }

  const prompt = `
You are an expert interviewer with personality "${interviewerType}" at difficulty level ${difficultyLevel}/7.
Target Role: "${jobRole}"
Candidate Candidate Experience Level: "${experienceLevel}" (e.g. Fresher / Entry Level vs Experienced Professional).

Goal: Perform ADAPTIVE & ROLE-SPECIFIC INTERVIEWING.

Instructions based on Experience Level ("${experienceLevel}"):
- IF "Fresher / Entry Level":
  - Ask about fundamental core concepts of ${jobRole}, academic/college projects, internships, coursework, problem-solving logic, passion for the domain, and learning agility.
  - Do NOT ask for multi-year corporate team management or senior executive budgets.
  - Focus on assessing potential, clarity of basics, enthusiasm, and structured reasoning.
- IF "Experienced Professional / Senior":
  - Ask about previous real-world project impact, system trade-offs, architecture, quantitative business metrics, cross-functional conflicts, leadership, and domain expertise in ${jobRole}.

Listen carefully to their last answer:
Last Answer: "${lastAnswer || 'Hello, I am ready for the interview.'}"

Previous Q&A History:
${JSON.stringify(history || [])}

Rules:
1. If their answer was generic, vague, or claimed results without specifics, PROBE THEM DIRECTLY.
   Example for Fresher: "You mentioned your final year project — what specific algorithms or libraries did YOU code yourself?"
   Example for Professional: "You said you improved performance — what exact metric did you track and how did you measure it?"
2. If their answer was strong, escalate difficulty according to Level ${difficultyLevel}.
3. Tailor every question specifically to ${jobRole}.

Return JSON:
{
  "question": "The exact question string tailored for ${jobRole} (${experienceLevel})",
  "reasoning": "Why this follow-up was chosen based on their candidate profile & previous response",
  "isProbingFollowUp": true/false,
  "coachingHint": "Subtle direction or focus tailored for a ${experienceLevel} answering a ${jobRole} interview question"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Adaptive Interview Error:', err.message);
    return generateFallbackInterviewQuestion(lastAnswer, interviewerType, difficultyLevel, jobRole, experienceLevel);
  }
}

/**
 * Evaluate Interview Answer (Dual Evaluation: WHAT + HOW)
 * Tailored for Role & Experience Level (Fresher vs Professional)
 */
export async function evaluateInterviewAnswer(
  question,
  answer,
  audioMetrics,
  interviewerType = 'Professional',
  jobRole = 'Software Engineer',
  experienceLevel = 'Fresher'
) {
  const ai = getGenAIClient();
  if (!ai) {
    return generateFallbackInterviewAnswerEval(question, answer, audioMetrics, experienceLevel);
  }

  const prompt = `
You are an elite Interview Coach evaluating a candidate for the role: "${jobRole}".
Candidate Experience Level: "${experienceLevel}"
Question asked: "${question}"
Candidate Answer: "${answer}"
Delivery Metrics: WPM=${audioMetrics.wpm || 135}, Fillers=${audioMetrics.fillerCount || 0}, Pauses=${audioMetrics.pauses || 'Good'}

Evaluate TWO things simultaneously:
1. WHAT THE USER SAID:
   - Relevance to ${jobRole}
   - Technical & Domain correctness for a ${experienceLevel}
   - Reasoning, Depth, Logic, and Problem-Solving
   - Structure & whether the question was answered
   - For Freshers: Evaluate project understanding, clarity of fundamentals, and enthusiasm.
   - For Professionals: Evaluate quantitative evidence, leadership, trade-off rationale, and value created.
2. HOW THE USER SAID IT:
   - Clarity, Confidence, Pace, Tone, Hesitation, Filler words, Conciseness, Vocal energy.

Return JSON:
{
  "overallScore": 82,
  "whatYouSaid": {
    "score": 80,
    "strengths": ["Clear domain logic relevant to ${jobRole}", "Demonstrated good foundational knowledge"],
    "weaknesses": ["Could provide a more concrete project example"],
    "didAnswerQuestion": true
  },
  "howYouSaidIt": {
    "score": 84,
    "confidence": "High",
    "paceRating": "Optimal (140 WPM)",
    "fillerWordAssessment": "Low filler usage",
    "deliveryFeedback": "Solid voice projection and structured delivery."
  },
  "coachingAction": {
    "needsRetell": true/false,
    "problemIdentified": "What the interviewer is still missing for a ${experienceLevel} in ${jobRole}",
    "directionToImprove": "Clear instruction tailored for ${experienceLevel} candidates",
    "exampleFraming": "Suggested response framing (e.g. Project -> Role -> Challenge -> Outcome for Freshers, or STAR metric format for Professionals)"
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Interview Eval Error:', err.message);
    return generateFallbackInterviewAnswerEval(question, answer, audioMetrics, experienceLevel);
  }
}

/**
 * Storytelling Retelling Loop Engine
 */
export async function generateStoryCoaching(round, storyText, promptTopic) {
  const ai = getGenAIClient();
  if (!ai) {
    return {
      round,
      feedback: "Focus on adding a clear conflict and visual scene details.",
      improvements: ["Start immediately at the moment of tension.", "Name the characters and stakes."],
      nextInstruction: "Tell the story again, starting at the moment everything went wrong."
    };
  }

  const prompt = `
You are a Master Storytelling Coach.
Mission: Transform Information -> Experience, Explanation -> Scene, Event -> Story.

Story Topic/Prompt: "${promptTopic}"
Current Round: Round ${round}
User's Story: "${storyText}"

Evaluate storytelling elements:
Hook, Curiosity, Context, Characters, Desire, Conflict, Stakes, Specificity, Emotion, Pacing, Suspense, Surprise, Meaning, Ending, Memorability.

Provide guidance for Round ${round === 3 ? 'Final Evaluation' : 'Next Retelling Loop'}.

Return JSON:
{
  "round": ${round},
  "score": 76,
  "elementChecklist": {
    "hook": "Strong" | "Weak",
    "conflict": "Clear" | "Missing",
    "stakes": "High" | "Low",
    "emotion": "Present" | "Flat",
    "memorability": "High" | "Medium" | "Low"
  },
  "biggestWeaknesses": ["Issue 1", "Issue 2"],
  "targetedImprovements": [
    "Instruction 1 for next attempt",
    "Instruction 2 for next attempt"
  ],
  "retellChallenge": "Specific instruction for telling Round ${round + 1} (e.g. 'Start at the moment of highest tension in line 1')"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Story Coaching Error:', err.message);
    return {
      round,
      score: 72,
      elementChecklist: { hook: "Weak", conflict: "Present", stakes: "Medium", emotion: "Present", memorability: "Medium" },
      biggestWeaknesses: ["Too much background setup before reaching the core event."],
      targetedImprovements: ["Cut the first 3 sentences of backstory.", "Describe what you saw and felt when the problem occurred."],
      retellChallenge: "Retell the story starting directly inside the scene."
    };
  }
}

/**
 * Wit Training & Contextual Humor Evaluator
 */
export async function generateWitChallenge(transcript, topic) {
  const ai = getGenAIClient();
  if (!ai) {
    return {
      techniqueUsed: "Analogy & Contrast",
      rating: "Good",
      feedback: "Natural understatement. Keep the rhythm punchy.",
      emotionalRhythm: "Depth -> Relief -> Payoff",
      isAppropriate: true
    };
  }

  const prompt = `
You are a Wit & Humor Coach for professional communicators.
Wit should support communication rather than turn the user into a stand-up comedian.
Train: Observation, Contrast, Analogy, Understatement, Exaggeration, Callbacks, Playful Phrasing, Self-Aware Humor, Timing, Surprise.

User Topic: "${topic}"
User Attempt: "${transcript}"

Evaluate:
1. Was the wit natural or forced?
2. Did it support depth (Depth -> Relief -> Depth -> Payoff)?
3. Is it appropriate for a professional setting?

Return JSON:
{
  "witScore": 82,
  "techniqueIdentified": "Observation / Understatement / Analogy / Contrast",
  "isNatural": true,
  "isAppropriate": true,
  "feedback": "Detailed feedback on timing and contrast",
  "witUpgrade": "How to make the phrasing sharper or more surprising without sounding canned",
  "emotionalRhythmStatus": "Good relief moment that lowered tension before the key point."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Wit Challenge Error:', err.message);
    return {
      witScore: 75,
      techniqueIdentified: "Contrast",
      isNatural: true,
      isAppropriate: true,
      feedback: "Solid observation. A brief pause before the punchline will heighten effect.",
      witUpgrade: "Contrast the high expectation with the mundane reality.",
      emotionalRhythmStatus: "Effective tension relief."
    };
  }
}

/**
 * Evaluate Session (Post-Session Analysis)
 */
export async function evaluateSession(transcript, metrics, mode = 'general', extraData = {}) {
  const ai = getGenAIClient();
  if (!ai) {
    return generateFallbackPostSessionReport(transcript, metrics, mode, extraData);
  }

  const prompt = `
Evaluate deeply and objectively based strictly on evidence in what the user said and how they delivered it.
Do NOT default to 80. Calculate dynamic scores (from 10 to 98) based on actual speech quality:

CRITICAL RULE FOR SHORT / BRIEF TRANSCRIPTS (1-5 words, e.g. "Hello", "I am ready", "Good morning"):
- Calculate a low diagnostic score (e.g. Communication Power 30-40, Storytelling 15, Engagement 20, Delivery 50, Wit 10, Memorability 15, Evidence 10, Structure 30).
- State the biggest weakness clearly: "The session consisted of an extremely brief opening statement (${(transcript || '').split(/\s+/).filter(Boolean).length} words: '${transcript}'). Failed to establish immediate engagement, technical depth, or a compelling reason for the audience to listen."
- Provide One Big Upgrade: "Follow the STAR framework (Situation -> Task -> Action -> Result) to expand your idea into a structured 30-second response with concrete evidence."

CRITICAL RULE FOR FULL TRANSCRIPTS (6+ words):
- Penalize heavily for excessive filler words (um, uh, like), rambling, or lack of quantitative evidence.
- Reward clear structure, concise phrasing, vivid storytelling, quantitative metrics, and optimal vocal pace (120-160 WPM).
- For every weakness listed, cite EXACT quotes/evidence from what the user said.

Session Mode: ${mode}
Transcript: "${transcript}"
Audio Metrics: WPM=${metrics.wpm || metrics.avgWpm || 135}, Fillers=${metrics.fillerCount || 0}, Pauses=${metrics.pauses || 'Good'}
Extra Data: ${JSON.stringify(extraData)}

Output valid JSON strictly adhering to schema:
{
  "communicationPower": 78,
  "scores": {
    "clarity": 80,
    "storytelling": 72,
    "engagement": 75,
    "wit": 65,
    "delivery": 78,
    "confidence": 82,
    "structure": 70,
    "vocabulary": 80,
    "responsiveness": 85,
    "audienceAwareness": 76,
    "conciseness": 68,
    "emotionalConnection": 74,
    "answerQuality": 80,
    "relevance": 85,
    "evidence": 70,
    "reasoning": 78,
    "problemSolving": 75,
    "professionalism": 88,
    "interviewImpact": 79
  },
  "whatWorked": [
    "Specific strength point 1 with quote or evidence",
    "Specific strength point 2 with quote or evidence"
  ],
  "biggestWeakness": "The single highest-impact problem identified during the session.",
  "oneBigUpgrade": "The single change that would transform the user's communication most.",
  "top3Improvements": [
    "Actionable improvement 1",
    "Actionable improvement 2",
    "Actionable improvement 3"
  ],
  "practiceExercise": {
    "title": "Exercise Name",
    "instruction": "Step-by-step exercise instructions tailored to fix their biggest weakness."
  },
  "memorabilityAssessment": {
    "score": 75,
    "whatListenerRemembers": "What a listener would actually remember 24 hours later.",
    "howToMakeUnforgettable": "Actionable advice to turn this response/speech from clear to unforgettable."
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error('Gemini Post-Session Analysis Error:', err.message);
    return generateFallbackPostSessionReport(transcript, metrics, mode, extraData);
  }
}

// Helpers
function generateFallbackPostSessionReport(transcript, metrics, mode, extraData) {
  const words = (transcript || '').split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillers = metrics.fillerCount || 0;
  const wpm = metrics.wpm || metrics.avgWpm || 135;

  let score = 70;

  if (wordCount < 5) {
    score = 35; // Brief 1-4 word statement
  } else if (wordCount < 15) {
    score = 52;
  } else if (wordCount < 30) {
    score = 68;
  } else if (wordCount >= 45) {
    score = 84;
  }

  // Bonus for zero fillers
  if (fillers === 0 && wordCount >= 15) score += 6;
  else score -= (fillers * 5);

  // Bonus for optimal pace (120 - 160 WPM)
  if (wpm >= 120 && wpm <= 165 && wordCount >= 20) {
    score += 5;
  } else if (wpm > 185) {
    score -= 8;
  }

  const finalScore = Math.max(15, Math.min(96, Math.round(score)));

  const hasMetrics = /\b(\d+%|\d+k|\d+m|\d+ million|\d+ billion|\d+x)\b/i.test(transcript);

  return {
    communicationPower: finalScore,
    scores: {
      clarity: wordCount < 5 ? 50 : finalScore,
      storytelling: wordCount < 5 ? 15 : Math.max(20, finalScore - 4),
      engagement: wordCount < 5 ? 20 : finalScore,
      wit: wordCount < 5 ? 10 : Math.max(15, finalScore - 8),
      delivery: wordCount < 5 ? 50 : Math.min(95, finalScore + 2),
      confidence: wordCount < 5 ? 50 : Math.min(95, finalScore + 4),
      structure: wordCount < 5 ? 30 : (hasMetrics ? Math.min(95, finalScore + 6) : finalScore),
      vocabulary: wordCount > 40 ? Math.min(95, finalScore + 5) : 65,
      responsiveness: finalScore,
      audienceAwareness: wordCount < 5 ? 20 : finalScore,
      conciseness: fillers > 2 ? 50 : (wordCount < 5 ? 40 : 88),
      emotionalConnection: Math.max(20, finalScore - 4),
      answerQuality: finalScore,
      relevance: Math.min(95, finalScore + 2),
      evidence: hasMetrics ? 92 : (wordCount < 5 ? 10 : 60),
      reasoning: finalScore,
      problemSolving: finalScore,
      professionalism: Math.min(96, finalScore + 4),
      interviewImpact: finalScore
    },
    whatWorked: wordCount < 5 ? [
      `Initiated vocal delivery cleanly (${wordCount} word${wordCount === 1 ? '' : 's'} recorded).`
    ] : [
      `Delivered a structured ${wordCount}-word response at an optimal pace of ${wpm} WPM.`,
      fillers === 0 ? "Maintained flawless delivery with 0 filler words." : `Kept filler usage to ${fillers} words.`,
      hasMetrics ? "Included quantitative metrics and business impact figures." : "Demonstrated clear domain communication."
    ],
    biggestWeakness: wordCount < 5 
      ? `Extremely brief statement (${wordCount} word${wordCount === 1 ? '' : 's'}: "${transcript}"). Failed to establish technical depth, context, or engagement.`
      : fillers > 1 
      ? `Used ${fillers} filler words ("um", "uh", "like") which diluted confidence and clarity.` 
      : !hasMetrics 
      ? "Answer lacked quantitative metrics or specific outcome figures."
      : "Could end with a stronger call-to-action or memorable summary statement.",
    oneBigUpgrade: wordCount < 5
      ? "Follow the STAR framework (Situation -> Task -> Action -> Result) to expand your idea into a structured response."
      : fillers > 0 
      ? "Pause silently when gathering thoughts instead of filling sound gaps."
      : "Use a 2-second silent pause before your concluding sentence to let key metrics land.",
    top3Improvements: [
      "State your core recommendation in sentence #1.",
      "Support claims with 1 concrete number or specific event.",
      "End with a clear, memorable closing statement."
    ],
    practiceExercise: {
      title: wordCount < 5 ? "30-Second STAR Expansion" : "The High-Impact Metric Drill",
      instruction: wordCount < 5 
        ? `Take your idea ("${transcript}") and expand it into a structured 30-second response with 1 specific metric.`
        : "Deliver your main recommendation in sentence 1, follow with 2 quantitative metrics, and stop cleanly."
    },
    memorabilityAssessment: {
      score: wordCount < 5 ? 15 : finalScore,
      whatListenerRemembers: wordCount < 5 ? "A brief opening remark." : "The core technical result and key conclusion.",
      howToMakeUnforgettable: "Incorporate a striking analogy, personal milestone, or high-stakes challenge."
    }
  };
}

function generateFallbackInterviewQuestion(lastAnswer, interviewerType, difficultyLevel, jobRole, experienceLevel) {
  const isFresher = (experienceLevel || '').toLowerCase().includes('fresher');

  const fresherQuestions = [
    `Walk me through your favorite academic or personal ${jobRole} project and your specific contribution.`,
    `What fundamental concepts in ${jobRole} do you feel most confident about, and how have you applied them?`,
    `Tell me about a challenging bug or problem you faced during coursework or an internship, and how you solved it.`,
    `Why are you interested in starting your career as a ${jobRole}, and what skills are you actively learning right now?`
  ];

  const professionalQuestions = [
    `Tell me about a major ${jobRole} initiative you led that delivered measurable business impact.`,
    `What trade-offs did you make in your most recent ${jobRole} project, and why?`,
    `How do you handle disagreement with senior stakeholders when making technical or strategic decisions in ${jobRole}?`,
    `Walk me through a situation where a ${jobRole} project was falling behind schedule, and what YOU specifically did to recover.`
  ];

  const questionSet = isFresher ? fresherQuestions : professionalQuestions;
  const idx = Math.floor(Math.random() * questionSet.length);

  return {
    question: questionSet[idx],
    reasoning: `Tailored Level ${difficultyLevel} question for a ${experienceLevel} interviewing for ${jobRole}.`,
    isProbingFollowUp: false,
    coachingHint: isFresher 
      ? "Focus on explaining your project logic, key learnings, and enthusiastic problem solving."
      : "Use clear quantitative metrics and STAR framework: Situation -> Task -> Action -> Result."
  };
}

function generateFallbackInterviewAnswerEval(question, answer, audioMetrics, experienceLevel) {
  const isFresher = (experienceLevel || '').toLowerCase().includes('fresher');
  return {
    overallScore: 80,
    whatYouSaid: {
      score: 78,
      strengths: ["Relevant to the domain question", "Clear logical flow"],
      weaknesses: isFresher ? ["Could explain your individual project contribution more clearly"] : ["Could quantify the impact with specific numbers"],
      didAnswerQuestion: true
    },
    howYouSaidIt: {
      score: 82,
      confidence: "Steady",
      paceRating: `${audioMetrics.wpm || 135} WPM (Good pace)`,
      fillerWordAssessment: `${audioMetrics.fillerCount || 0} filler words detected`,
      deliveryFeedback: "Good vocal energy and structured delivery."
    },
    coachingAction: {
      needsRetell: false,
      problemIdentified: isFresher ? "Interviewer wants to see your exact personal coding/project role." : "Interviewer needs specific proof of business impact.",
      directionToImprove: isFresher ? "Highlight what YOU specifically built vs team contribution." : "State the quantitative outcome in your first two sentences.",
      exampleFraming: isFresher ? "Framing: 'In my project X, my role was Y, and I built Z using technology W.'" : "STAR Framework: 'In situation X, my action Y led to result Z.'"
    }
  };
}
