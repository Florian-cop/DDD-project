import { ICustomerRepository, Customer, Email } from '../../../domain/customer';
import { CreateCustomerCommand } from './CreateCustomerCommand';

export class CreateCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    const emailVO = Email.create(command.email);
    
    const existingCustomer = await this.customerRepository.findByEmail(emailVO);
    
    if (existingCustomer) {
      throw new Error(`Customer with email "${command.email}" already exists`);
    }

    const customer = Customer.create(
      command.email,
      command.firstname,
      command.lastname,
      command.phoneNumber
    );

    await this.customerRepository.save(customer);

    return customer;
  }
}
