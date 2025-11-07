import { ICustomerRepository, Customer } from '../../../domain/customer';
import { GetCustomerQuery } from './GetCustomerQuery';

export class GetCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findOneById(query.id);
    
    if (!customer) {
      throw new Error(`Customer with id "${query.id}" not found`);
    }

    return customer;
  }
}
