import { ICustomerRepository, Customer, Email } from '@domain/customer';
import { IWalletRepository, Wallet } from '@domain/wallet';
import { CreateCustomerCommand } from './CreateCustomerCommand';
import { PrismaClient } from '@prisma/client';
import { CustomerRepository } from '@infrastructure/db/repositories/CustomerRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';

export class CreateCustomerService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly prisma: PrismaClient
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

    await this.prisma.$transaction(async (tx) => {
      const txCustomerRepo = new CustomerRepository(tx as PrismaClient);
      const txWalletRepo = new WalletRepository(tx as PrismaClient);
      
      await txCustomerRepo.save(customer);
      
      const wallet = Wallet.create(customer.id);
      await txWalletRepo.save(wallet);
    });

    return customer;
  }
}
