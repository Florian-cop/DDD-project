import { Router } from 'express';
import { createCustomerRouter } from './customerRouter';

export const createApiRouter = (): Router => {
  const apiRouter = Router();
  
  apiRouter.use('/api', createCustomerRouter());
  
  apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  return apiRouter;
};

export { createCustomerRouter };
