import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Session middleware to manage guest cart sessions
 */
export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get session ID from header or create new one
  let sessionId = req.headers['x-session-id'] as string;

  if (!sessionId || sessionId.trim().length === 0) {
    // Generate new session ID
    sessionId = uuidv4();
    // Return session ID in response header for client to store
    res.setHeader('X-Session-Id', sessionId);
  }

  // Attach session ID to request
  req.sessionId = sessionId;

  next();
};

/**
 * Extend Express Request interface to include sessionId
 */
declare global {
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}
