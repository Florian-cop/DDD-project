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
  
  apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  return apiRouter;
};

export { createCustomerRouter, createWalletRouter, createRoomRouter, createAdminRouter };
