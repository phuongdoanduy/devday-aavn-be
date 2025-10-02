import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ErrorResponse } from '../../responses/ErrorResponse';

/**
 * Middleware to validate request data using Zod schemas
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json(
          ErrorResponse.create('VALIDATION_ERROR', 'Validation failed', { errors })
        );
      }

      next(error);
    }
  };
};
