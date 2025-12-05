
export { 
  Customer, 
  ICustomerProps, 
  Email, 
  PersonName, 
  PhoneNumber, 
  ICustomerRepository
} from './domain/customer';

export { CreateCustomerCommand } from './application/customer/CreateCustomerCommand';
export { CreateCustomerService } from './application/customer/CreateCustomerService';
export { UpdateCustomerCommand } from './application/customer/UpdateCustomerCommand';
export { UpdateCustomerService } from './application/customer/UpdateCustomerService';
export { DeleteCustomerCommand } from './application/customer/DeleteCustomerCommand';
export { DeleteCustomerService } from './application/customer/DeleteCustomerService';
export { GetCustomerQuery } from './application/customer/GetCustomerQuery';
export { GetCustomerService } from './application/customer/GetCustomerService';
export { GetAllCustomersService } from './application/customer/GetAllCustomersService';

export { CustomerRepository } from './infrastructure/db/repositories/CustomerRepository';
export { CreateCustomerController } from './infrastructure/express/controllers/customer/CreateCustomerController';
export { UpdateCustomerController } from './infrastructure/express/controllers/customer/UpdateCustomerController';
export { DeleteCustomerController } from './infrastructure/express/controllers/customer/DeleteCustomerController';
export { GetCustomerController } from './infrastructure/express/controllers/customer/GetCustomerController';
export { GetAllCustomersController } from './infrastructure/express/controllers/customer/GetAllCustomersController';
export { createCustomerRouter, createApiRouter } from './infrastructure/express/router';
export { getPrismaClient, disconnectPrisma } from './infrastructure/db/prisma';

export type { 
  CreateCustomerDTO, 
  UpdateCustomerDTO, 
  CustomerResponseDTO 
} from './infrastructure/express/dtos/CustomerDTO';
