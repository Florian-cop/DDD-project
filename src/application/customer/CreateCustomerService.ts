import { ICustomerRepository, Customer, Email } from '@domain/customer';
import { IWalletRepository, Wallet } from '@domain/wallet';
import { CreateCustomerCommand } from './CreateCustomerCommand';

export class CreateCustomerService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository
  ) {}

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

    // Transaction: créer client ET wallet de manière atomique
    await this.customerRepository.save(customer);
    const wallet = Wallet.create(customer.id);
    await this.walletRepository.save(wallet);

    return customer;
  }
}
