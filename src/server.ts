import express, { Application } from 'express';
import { createApiRouter } from './infrastructure/express/router';
import { getPrismaClient, disconnectPrisma } from './infrastructure/db/prisma';
import { errorHandler } from './infrastructure/express/middleware/errorHandler';
import { validateEnv } from './infrastructure/config/env';
import { setupSwagger } from './infrastructure/express/swagger';

// Valider les variables d'environnement au démarrage
const env = validateEnv();

const app: Application = express();
const PORT = env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
setupSwagger(app);

// Routes
app.use(createApiRouter());

// Error handling middleware (doit être après les routes)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  // Server started
});

// Graceful shutdown
const gracefulShutdown = async () => {
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
