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
  
  router.get('/wallets/customer/:customerId', (req, res) => getWalletController.handle(req, res));
  router.put('/wallets/customer/:customerId', (req, res) => updateWalletController.handle(req, res));
  router.patch('/wallets/customer/:customerId', (req, res) => updateWalletController.handle(req, res));
  router.delete('/wallets/customer/:customerId', (req, res) => deleteWalletController.handle(req, res));
  
  return router;
};
