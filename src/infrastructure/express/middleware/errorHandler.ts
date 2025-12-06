import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (res.headersSent) {
    return next(err);
  }

  if (err.message.includes('not found') || err.message.includes('introuvable')) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
  }

  if (
    err.message.includes('already exists') ||
    err.message.includes('déjà') ||
    err.message.includes('Insufficient funds') ||
    err.message.includes('Invalid')
  ) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
};
