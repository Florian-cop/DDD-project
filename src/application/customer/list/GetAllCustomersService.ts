import { ICustomerRepository } from '../../../domain/customer/ICustomerRepository';
import { Customer } from '../../../domain/customer/Customer';

export class GetAllCustomersService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }
}
