import { Router } from 'express';
import { CustomerRepository } from '../../db/repositories/CustomerRepository';
import { WalletRepository } from '../../db/repositories/WalletRepository';
import { CreateCustomerService } from '../../../application/customer/CreateCustomerService';
import { UpdateCustomerService } from '../../../application/customer/UpdateCustomerService';
import { DeleteCustomerService } from '../../../application/customer/DeleteCustomerService';
import { GetCustomerService } from '../../../application/customer/GetCustomerService';
import { GetAllCustomersService } from '../../../application/customer/GetAllCustomersService';
import { CreateCustomerController } from '../controllers/customer/CreateCustomerController';
import { UpdateCustomerController } from '../controllers/customer/UpdateCustomerController';
import { DeleteCustomerController } from '../controllers/customer/DeleteCustomerController';
import { GetCustomerController } from '../controllers/customer/GetCustomerController';
import { GetAllCustomersController } from '../controllers/customer/GetAllCustomersController';
import { getPrismaClient } from '../../db/prisma';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from '../validation/schemas';

export const createCustomerRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const customerRepository = new CustomerRepository(prisma);
  const walletRepository = new WalletRepository(prisma);
  
  const createCustomerService = new CreateCustomerService(customerRepository, walletRepository);
  const updateCustomerService = new UpdateCustomerService(customerRepository);
  const deleteCustomerService = new DeleteCustomerService(customerRepository);
  const getCustomerService = new GetCustomerService(customerRepository);
  const getAllCustomersService = new GetAllCustomersService(customerRepository);
  
  const createCustomerController = new CreateCustomerController(createCustomerService);
  const updateCustomerController = new UpdateCustomerController(updateCustomerService);
  const deleteCustomerController = new DeleteCustomerController(deleteCustomerService);
  const getCustomerController = new GetCustomerController(getCustomerService);
  const getAllCustomersController = new GetAllCustomersController(getAllCustomersService);
  
  /**
   * @swagger
   * /api/customers:
   *   post:
   *     summary: Créer un nouveau client
   *     tags: [Customers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - firstname
   *               - lastname
   *               - phoneNumber
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: alice.smith@example.com
   *               firstname:
   *                 type: string
   *                 minLength: 1
   *                 example: Alice
   *               lastname:
   *                 type: string
   *                 minLength: 1
   *                 example: Smith
   *               phoneNumber:
   *                 type: string
   *                 example: +33612345678
   *     responses:
   *       201:
   *         description: Client créé avec succès (+ wallet automatique)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Customer'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/customers', validate(createCustomerSchema), (req, res) => createCustomerController.handle(req, res));
  
  /**
   * @swagger
   * /api/customers:
   *   get:
   *     summary: Liste tous les clients
   *     tags: [Customers]
   *     responses:
   *       200:
   *         description: Liste des clients
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Customer'
   */
  router.get('/customers', (req, res) => getAllCustomersController.handle(req, res));
  
  /**
   * @swagger
   * /api/customers/{id}:
   *   get:
   *     summary: Récupérer un client par ID
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du client
   *     responses:
   *       200:
   *         description: Client trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Customer'
   *       404:
   *         description: Client non trouvé
   */
  router.get('/customers/:id', (req, res) => getCustomerController.handle(req, res));
  
  /**
   * @swagger
   * /api/customers/{id}:
   *   put:
   *     summary: Mettre à jour un client
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
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
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               firstname:
   *                 type: string
   *               lastname:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *     responses:
   *       200:
   *         description: Client mis à jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Customer'
   *       404:
   *         description: Client non trouvé
   */
  router.put('/customers/:id', validate(updateCustomerSchema), (req, res) => updateCustomerController.handle(req, res));
  
  /**
   * @swagger
   * /api/customers/{id}:
   *   patch:
   *     summary: Mettre à jour partiellement un client
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
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
   *             properties:
   *               email:
   *                 type: string
   *               firstname:
   *                 type: string
   *               lastname:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *     responses:
   *       200:
   *         description: Client mis à jour
   *       404:
   *         description: Client non trouvé
   */
  router.patch('/customers/:id', validate(updateCustomerSchema), (req, res) => updateCustomerController.handle(req, res));
  
  /**
   * @swagger
   * /api/customers/{id}:
   *   delete:
   *     summary: Supprimer un client
   *     tags: [Customers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Client supprimé
   *       404:
   *         description: Client non trouvé
   */
  router.delete('/customers/:id', (req, res) => deleteCustomerController.handle(req, res));
  
  return router;
};
