import { ICustomerRepository } from '../../../domain/customer/ICustomerRepository';
import { Customer } from '../../../domain/customer/Customer';
import { CreateCustomerCommand } from './CreateCustomerCommand';

export class CreateCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    const existingCustomers = await this.customerRepository.findAll();
    const emailExists = existingCustomers.some(
      (customer) => customer.email.value.toLowerCase() === command.email.toLowerCase()
    );

    if (emailExists) {
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
