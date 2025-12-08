import { Router } from 'express';
import { WalletRepository } from '../../db/repositories/WalletRepository';
import { CustomerRepository } from '../../db/repositories/CustomerRepository';
import { GetWalletService } from '../../../application/wallet/GetWalletService';
import { AddFundsToWalletService } from '../../../application/wallet/AddFundsToWalletService';
import { GetWalletController } from '../controllers/wallet/GetWalletController';
import { AddFundsToWalletController } from '../controllers/wallet/AddFundsToWalletController';
import { getPrismaClient } from '../../db/prisma';
import { validate } from '../middleware/validate';
import { validateParams } from '../middleware/validateQuery';
import { addFundsToWalletSchema, customerIdParamSchema } from '../validation/schemas';

export const createWalletRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const walletRepository = new WalletRepository(prisma);
  const customerRepository = new CustomerRepository(prisma);
  
  const getWalletService = new GetWalletService(walletRepository, customerRepository);
  const addFundsToWalletService = new AddFundsToWalletService(walletRepository, customerRepository);
  
  const getWalletController = new GetWalletController(getWalletService);
  const addFundsToWalletController = new AddFundsToWalletController(addFundsToWalletService);

  router.get('/wallets/customer/:customerId', validateParams(customerIdParamSchema), (req, res) => getWalletController.handle(req, res));

  router.put('/wallets/customer/:customerId', validateParams(customerIdParamSchema), validate(addFundsToWalletSchema), (req, res) => addFundsToWalletController.handle(req, res));

  router.patch('/wallets/customer/:customerId', validateParams(customerIdParamSchema), validate(addFundsToWalletSchema), (req, res) => addFundsToWalletController.handle(req, res));
  
  return router;
};
