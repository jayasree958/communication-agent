import express from 'express';
// Trigger Netlify Production Deployment with Environment GEMINI_API_KEY
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send(`
        <html>
          <body style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 40px; text-align: center;">
            <h1 style="color: #6366f1;">IMPACT — AI Communication Coach Server Running</h1>
            <p>Frontend dev server running on Vite port (typically 5173). Backend API running on port ${PORT}.</p>
          </body>
        </html>
      `);
    }
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 IMPACT Backend Server running on http://localhost:${PORT}`);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_actual_gemini_api_key_here')) {
    console.log(`\n⚠️  SECURITY NOTICE: GEMINI_API_KEY environment variable is NOT configured.`);
    console.log(`   To enable full Gemini AI coaching:`);
    console.log(`   1. Create a file named .env in the project root.`);
    console.log(`   2. Add line: GEMINI_API_KEY=your_gemini_api_key_here`);
    console.log(`   3. Restart the server.\n`);
  } else {
    console.log(`🔒 SECURITY CONFIRMED: GEMINI_API_KEY is securely configured server-side.`);
  }
  console.log(`==================================================\n`);
});
