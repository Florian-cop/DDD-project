import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de gestion d'erreurs
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Erreur de validation (déjà gérée par le middleware validate)
  if (res.headersSent) {
    return next(err);
  }

  // Erreurs métier du domaine
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

  // Erreur serveur par défaut
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  });
};
