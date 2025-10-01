import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../../../domain/exceptions/DomainException';
import { ErrorResponse } from '../../responses/ErrorResponse';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof DomainException) {
    return res.status(400).json(
      ErrorResponse.create(err.code, err.message)
    );
  }

  res.status(500).json(
    ErrorResponse.create('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')
  );
}
