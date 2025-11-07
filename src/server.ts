import express, { Application } from 'express';
import { createApiRouter } from './infrastructure/express/router';
import { getPrismaClient, disconnectPrisma } from './infrastructure/db/prisma';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(createApiRouter());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST   /api/customers`);
  console.log(`   GET    /api/customers`);
  console.log(`   GET    /api/customers/:id`);
  console.log(`   PUT    /api/customers/:id`);
  console.log(`   PATCH  /api/customers/:id`);
  console.log(`   DELETE /api/customers/:id`);
  console.log(`   GET    /health`);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    await disconnectPrisma();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
