import { Wallet } from '@domain/wallet';
import { IWalletRepository } from '@domain/wallet';
import { ICustomerRepository } from '@domain/customer/repositories/ICustomerRepository';
import { GetWalletQuery } from './GetWalletQuery';

export class GetWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(query: GetWalletQuery): Promise<Wallet> {
    const customer = await this.customerRepository.findOneById(query.customerId);

    if (!customer) {
      throw new Error(`Customer with id "${query.customerId}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(query.customerId);

    if (!wallet) {
      throw new Error(`Wallet for customer "${query.customerId}" not found`);
    }

    return wallet;
  }
}
