import { Router } from 'express';
import { createCustomerRouter } from './customerRouter';
import { createWalletRouter } from './walletRouter';
import { createRoomRouter } from './roomRouter';
import { createAdminRouter } from './adminRouter';

export const createApiRouter = (): Router => {
  const apiRouter = Router();
  
  apiRouter.use('/api', createCustomerRouter());
  apiRouter.use('/api', createWalletRouter());
  apiRouter.use('/api', createRoomRouter());
  apiRouter.use('/api', createAdminRouter());

  apiRouter.get('/health', async (req, res) => {
    try {
      const { getPrismaClient } = await import('../../db/prisma.js');
      const prisma = getPrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    } catch (error) {
      res.status(503).json({ 
        status: 'error', 
        timestamp: new Date().toISOString(),
        database: 'disconnected'
      });
    }
  });
  
  return apiRouter;
};

export { createCustomerRouter, createWalletRouter, createRoomRouter, createAdminRouter };
