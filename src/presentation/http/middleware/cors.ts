import cors from 'cors';
import { config } from '../../../infrastructure/config/env.config';

export const corsMiddleware = cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id', 'x-session-id']
});
