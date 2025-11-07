import { IRepository } from '../../../core/IRepository';
import { Customer } from '../entities/Customer';
import { Email } from '../value-objects/Email';

export interface ICustomerRepository extends IRepository<Customer> {
  findByEmail(email: Email): Promise<Customer | null>;
}
