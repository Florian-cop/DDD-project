import { Router } from 'express';
import { WalletRepository } from '../../db/repositories/WalletRepository';
import { CustomerRepository } from '../../db/repositories/CustomerRepository';
import { GetWalletService } from '../../../application/wallet/GetWalletService';
import { UpdateWalletService } from '../../../application/wallet/UpdateWalletService';
import { DeleteWalletService } from '../../../application/wallet/DeleteWalletService';
import { GetWalletController } from '../controllers/wallet/GetWalletController';
import { UpdateWalletController } from '../controllers/wallet/UpdateWalletController';
import { DeleteWalletController } from '../controllers/wallet/DeleteWalletController';
import { getPrismaClient } from '../../db/prisma';
import { validate } from '../middleware/validate';
import { updateWalletSchema } from '../validation/schemas';

export const createWalletRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const walletRepository = new WalletRepository(prisma);
  const customerRepository = new CustomerRepository(prisma);
  
  const getWalletService = new GetWalletService(walletRepository, customerRepository);
  const updateWalletService = new UpdateWalletService(walletRepository, customerRepository);
  const deleteWalletService = new DeleteWalletService(walletRepository, customerRepository);
  
  const getWalletController = new GetWalletController(getWalletService);
  const updateWalletController = new UpdateWalletController(updateWalletService);
  const deleteWalletController = new DeleteWalletController(deleteWalletService);
  
  /**
   * @swagger
   * /api/wallets/customer/{customerId}:
   *   get:
   *     summary: Récupérer le portefeuille d'un client
   *     tags: [Wallets]
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du client
   *     responses:
   *       200:
   *         description: Portefeuille trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Wallet'
   *       404:
   *         description: Portefeuille non trouvé
   */
  router.get('/wallets/customer/:customerId', (req, res) => getWalletController.handle(req, res));
  
  /**
   * @swagger
   * /api/wallets/customer/{customerId}:
   *   put:
   *     summary: Ajouter des fonds au portefeuille (multi-devises)
   *     tags: [Wallets]
   *     description: Ajoute des fonds dans la devise spécifiée. Conversion automatique en EUR.
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *               - currency
   *             properties:
   *               amount:
   *                 type: number
   *                 minimum: 0.01
   *                 description: Montant à ajouter
   *                 example: 100
   *               currency:
   *                 type: string
   *                 enum: [EUR, USD, GBP, JPY, CHF]
   *                 description: Devise du montant
   *                 example: EUR
   *     responses:
   *       200:
   *         description: Fonds ajoutés avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Wallet'
   *       400:
   *         description: Montant invalide ou devise non supportée
   *       404:
   *         description: Portefeuille non trouvé
   */
  router.put('/wallets/customer/:customerId', validate(updateWalletSchema), (req, res) => updateWalletController.handle(req, res));
  
  /**
   * @swagger
   * /api/wallets/customer/{customerId}:
   *   patch:
   *     summary: Ajouter des fonds (alias de PUT)
   *     tags: [Wallets]
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *               - currency
   *             properties:
   *               amount:
   *                 type: number
   *                 minimum: 0.01
   *               currency:
   *                 type: string
   *                 enum: [EUR, USD, GBP, JPY, CHF]
   *     responses:
   *       200:
   *         description: Fonds ajoutés
   */
  router.patch('/wallets/customer/:customerId', validate(updateWalletSchema), (req, res) => updateWalletController.handle(req, res));
  
  /**
   * @swagger
   * /api/wallets/customer/{customerId}:
   *   delete:
   *     summary: Supprimer un portefeuille
   *     tags: [Wallets]
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Portefeuille supprimé
   *       404:
   *         description: Portefeuille non trouvé
   */
  router.delete('/wallets/customer/:customerId', (req, res) => deleteWalletController.handle(req, res));
  
  return router;
};
