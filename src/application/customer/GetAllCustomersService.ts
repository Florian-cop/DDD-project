import { ICustomerRepository, Customer } from '../../../domain/customer';

export class GetAllCustomersService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }
}
