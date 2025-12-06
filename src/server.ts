import express, { Application } from 'express';
import { createApiRouter } from './infrastructure/express/router';
import { getPrismaClient, disconnectPrisma } from './infrastructure/db/prisma';
import { errorHandler } from './infrastructure/express/middleware/errorHandler';
import { validateEnv } from './infrastructure/config/env';
import { setupSwagger } from './infrastructure/express/swagger';

const env = validateEnv();

const app: Application = express();
const PORT = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use(createApiRouter());

app.use(errorHandler);

const server = app.listen(PORT, () => {
  
});

const gracefulShutdown = async () => {
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
