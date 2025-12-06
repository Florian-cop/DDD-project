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
  
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Vérifier la santé de l'application
   *     tags: [Health]
   *     description: Vérifie la connexion à la base de données PostgreSQL
   *     responses:
   *       200:
   *         description: Application en bonne santé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 database:
   *                   type: string
   *                   example: connected
   *       503:
   *         description: Service indisponible (DB déconnectée)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 database:
   *                   type: string
   *                   example: disconnected
   */
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
