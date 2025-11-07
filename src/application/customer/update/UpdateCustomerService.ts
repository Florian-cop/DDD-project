import { ICustomerRepository } from '../../../domain/customer/ICustomerRepository';
import { Customer } from '../../../domain/customer/Customer';
import { Email } from '../../../domain/customer/Email';
import { PersonName } from '../../../domain/customer/PersonName';
import { PhoneNumber } from '../../../domain/customer/PhoneNumber';
import { UpdateCustomerCommand } from './UpdateCustomerCommand';

export class UpdateCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOneById(command.id);
    
    if (!existingCustomer) {
      throw new Error(`Customer with id "${command.id}" not found`);
    }

    if (command.email && command.email !== existingCustomer.email.value) {
      const allCustomers = await this.customerRepository.findAll();
      const emailExists = allCustomers.some(
        (customer) => 
          customer.id !== command.id && 
          customer.email.value.toLowerCase() === command.email!.toLowerCase()
      );

      if (emailExists) {
        throw new Error(`Email "${command.email}" is already used by another customer`);
      }
    }

   const email = command.email 
      ? Email.create(command.email) 
      : existingCustomer.email;

    const name = (command.firstname || command.lastname)
      ? PersonName.create(
          command.firstname || existingCustomer.firstname,
          command.lastname || existingCustomer.lastname
        )
      : existingCustomer.name;

    const phoneNumber = command.phoneNumber
      ? PhoneNumber.create(command.phoneNumber)
      : existingCustomer.phoneNumber;

     const updatedCustomer = Customer.fromValueObjects(
      { email, name, phoneNumber },
      existingCustomer.id
    );

    await this.customerRepository.save(updatedCustomer);

    return updatedCustomer;
  }
}
