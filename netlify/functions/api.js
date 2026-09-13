import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from '../../server/routes/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount API router
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

export const handler = serverless(app);
