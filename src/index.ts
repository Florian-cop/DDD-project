
export { Customer, ICustomerProps } from './domain/customer/Customer';
export { Email } from './domain/customer/Email';
export { PersonName } from './domain/customer/PersonName';
export { PhoneNumber } from './domain/customer/PhoneNumber';
export { ICustomerRepository } from './domain/customer/ICustomerRepository';

export { CreateCustomerCommand } from './application/customer/create/CreateCustomerCommand';
export { CreateCustomerService } from './application/customer/create/CreateCustomerService';
export { UpdateCustomerCommand } from './application/customer/update/UpdateCustomerCommand';
export { UpdateCustomerService } from './application/customer/update/UpdateCustomerService';
export { DeleteCustomerCommand } from './application/customer/delete/DeleteCustomerCommand';
export { DeleteCustomerService } from './application/customer/delete/DeleteCustomerService';
export { GetCustomerQuery } from './application/customer/get/GetCustomerQuery';
export { GetCustomerService } from './application/customer/get/GetCustomerService';
export { GetAllCustomersService } from './application/customer/list/GetAllCustomersService';

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
