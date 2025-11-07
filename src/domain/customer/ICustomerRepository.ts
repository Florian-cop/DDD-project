import { IRepository } from '../../core/IRepository';
import { Customer } from './Customer';

export interface ICustomerRepository extends IRepository<Customer> {}
