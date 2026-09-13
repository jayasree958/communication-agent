# IMPACT — AI Communication, Storytelling, Wit & Interview Coach

![IMPACT Coach Banner](https://img.shields.io/badge/IMPACT-AI_Communication_Coach-6366f1?style=for-the-badge&logo=sparkles)
![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_TypeScript_%7C_Vite_%7C_Express_%7C_Gemini_AI-38bdf8?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deploy-Netlify_Serverless-10b981?style=for-the-badge)

> **Core Mission**: Make the user impossible to ignore — across executive presentation, unforgettable storytelling, public speaking under pressure, natural wit, and high-stakes interviews.

---

## 🌟 Product Purpose & Coaching Framework

**IMPACT** is an intelligent, real-time AI communication coach that listens to actual spoken audio, transcribes live speech, evaluates delivery and content metrics, and provides evidence-based actionable feedback.

### Central Coaching Loop
```
USER SPEAKS ➔ LIVE SPEECH RECOGNITION ➔ METRIC & TRANSCRIPT ENGINE ➔ GEMINI AI ANALYSIS ➔ EVIDENCE-BASED FEEDBACK ➔ TARGETED PRACTICE EXERCISES ➔ PROGRESS & ERROR MEMORY
```

---

## 🚀 Key Feature Modules

### 1. 🎯 Multi-Mode Training Suite
- **Interview Coaching Mode**: Adaptive interview practice tailored to target industry roles and candidate experience levels. Evaluates both **WHAT YOU SAID** (technical accuracy, domain logic, structure) and **HOW YOU SAID IT** (pace, confidence, vocal energy, filler words).
- **Storytelling Retelling Loop**: 3-round iterative storytelling engine. Analyzes hooks, tension, character motivation, scene specificity, pacing, stakes, and memorability.
- **Public Speaking & Presentation Mode**: Trains balance of *Depth + Clarity + Lightness*. Evaluates audience hooks, structure, transitions, and call-to-action.
- **Wit & Lightness Training**: Contextual humor and playful observation coach. Teaches natural wit without sounding canned or forcing jokes.
- **Audience Simulation & Conversation**: Simulates real audience reactions and dynamic follow-up questions.

### 2. 💼 Interview Customization (Role & Seniority)
Tailor interview practice to specific candidate profiles:
- **Comprehensive Industry Job Roles**: Software Engineer / Full Stack, Product Manager, Data Scientist / AI Engineer, Sales & Business Dev, Marketing & Growth Manager, Financial Analyst, Human Resources / Recruiter, UI/UX Designer, DevOps / Cloud Architect, Cybersecurity Specialist, Operations & Supply Chain Manager, Strategy & Management Consultant, Customer Success Lead, Project Manager / Scrum Master, and Custom Role input.
- **Granular Experience Levels**:
  - 🎓 **Fresher / Entry Level (0-1 yrs)**: Assesses core logic, academic/personal projects, internships, and learning agility.
  - 💼 **Mid-Level Professional (2-5 yrs)**: Assesses practical execution, domain ownership, collaboration, and metric achievements.
  - 🚀 **Senior Specialist / Team Lead (5-8 yrs)**: Assesses architecture trade-offs, deep domain expertise, mentoring, and risk management.
  - 👔 **Manager / Director (8-12 yrs)**: Assesses team leadership, resource allocation, cross-departmental alignment, and execution.
  - 👑 **Executive / VP / C-Suite (12+ yrs)**: Assesses P&L leadership, strategic ROI, organizational vision, and company culture.

### 3. 📊 Deep Evidence-Based Post-Session Report
- **Communication Power Score (0–100)**: Holistic delivery and content score.
- **12 Multi-Dimensional Subscores**: Clarity, Storytelling, Engagement, Wit, Delivery, Confidence, Structure, Vocabulary, Responsiveness, Audience Awareness, Conciseness, Emotional Connection.
- **What Worked**: Specific strengths proven by quote/evidence from what the user said.
- **Where You Are Lacking**: Highest impact problem identified with actual evidence.
- **One Big Upgrade**: Single highest-leverage change to transform communication.
- **Targeted Practice Exercise**: Customized step-by-step exercise to practice immediately.
- **Audience Memorability Assessment**: Audit of what a listener remembers 24 hours later and how to make it unforgettable.
- **Analyzed Session Transcript**: Complete transcript analyzed by Gemini.

### 4. 📈 Progress & Error Memory
- Tracks recurring weaknesses across sessions (e.g. filler words, fast speaking, weak hooks, rambling, lack of quantitative evidence).
- Charts historical performance trends over time.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Vanilla CSS Design System (Glassmorphic dark mode).
- **Audio & Speech Engine**: Web Speech API (`SpeechRecognitionEngine`), Web Audio API (`MediaEngine` for RMS volume & vocal energy).
- **Backend**: Express.js server, Node.js (`server/index.js`).
- **Serverless**: Netlify Serverless Functions (`netlify/functions/api.js`).
- **AI Engine**: Google Gemini API via official `@google/genai` SDK using `gemini-2.0-flash`.

---

## 🔒 Gemini API Key & Environment Security

> [!IMPORTANT]
> The Gemini API key is managed strictly through server-side environment variables. It is **never** committed to Git, exposed in frontend source code, or hardcoded.

### Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/jayasree958/communication-agent.git
   cd communication-agent
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   ```

4. **Run Application**:
   - Start local dev servers:
     ```bash
     # Terminal 1: Backend Server (Port 3001)
     npm run dev:server

     # Terminal 2: Frontend Client (Port 5173 with Vite proxy)
     npm run dev:client
     ```
   - Open browser at `http://localhost:5173`.

---

## 🚀 Deployment to Netlify

1. Connect your GitHub repository `https://github.com/jayasree958/communication-agent.git` to Netlify.
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Functions Directory**: `netlify/functions`
3. **Environment Variables**:
   In Netlify Site Settings ➔ Environment Variables, add:
   - Key: `GEMINI_API_KEY`
   - Value: `(Your Gemini API Key)`

---

## 📜 Security Guidelines
- Always verify `.env` is listed in `.gitignore`.
- Run `git status` before committing to ensure no credentials are present.
- Never output full API keys in logs or responses.