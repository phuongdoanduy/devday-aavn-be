import cors from 'cors';
import { config } from '@infrastructure/config/env.config';

export const corsMiddleware = cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
