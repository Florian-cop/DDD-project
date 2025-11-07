import { Router } from 'express';
import { CustomerRepository } from '../../db/repositories/CustomerRepository';
import { CreateCustomerService } from '../../../application/customer/create/CreateCustomerService';
import { UpdateCustomerService } from '../../../application/customer/update/UpdateCustomerService';
import { DeleteCustomerService } from '../../../application/customer/delete/DeleteCustomerService';
import { GetCustomerService } from '../../../application/customer/get/GetCustomerService';
import { GetAllCustomersService } from '../../../application/customer/list/GetAllCustomersService';
import { CreateCustomerController } from '../controllers/customer/CreateCustomerController';
import { UpdateCustomerController } from '../controllers/customer/UpdateCustomerController';
import { DeleteCustomerController } from '../controllers/customer/DeleteCustomerController';
import { GetCustomerController } from '../controllers/customer/GetCustomerController';
import { GetAllCustomersController } from '../controllers/customer/GetAllCustomersController';
import { getPrismaClient } from '../../db/prisma';

export const createCustomerRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const customerRepository = new CustomerRepository(prisma);
  
  const createCustomerService = new CreateCustomerService(customerRepository);
  const updateCustomerService = new UpdateCustomerService(customerRepository);
  const deleteCustomerService = new DeleteCustomerService(customerRepository);
  const getCustomerService = new GetCustomerService(customerRepository);
  const getAllCustomersService = new GetAllCustomersService(customerRepository);
  
  const createCustomerController = new CreateCustomerController(createCustomerService);
  const updateCustomerController = new UpdateCustomerController(updateCustomerService);
  const deleteCustomerController = new DeleteCustomerController(deleteCustomerService);
  const getCustomerController = new GetCustomerController(getCustomerService);
  const getAllCustomersController = new GetAllCustomersController(getAllCustomersService);
  
  router.post('/customers', (req, res) => createCustomerController.handle(req, res));
  router.get('/customers', (req, res) => getAllCustomersController.handle(req, res));
  router.get('/customers/:id', (req, res) => getCustomerController.handle(req, res));
  router.put('/customers/:id', (req, res) => updateCustomerController.handle(req, res));
  router.patch('/customers/:id', (req, res) => updateCustomerController.handle(req, res));
  router.delete('/customers/:id', (req, res) => deleteCustomerController.handle(req, res));
  
  return router;
};
