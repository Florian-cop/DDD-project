import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';
import { ICustomerRepository } from '../../domain/customer/repositories/ICustomerRepository';
import { UpdateWalletCommand } from './UpdateWalletCommand';

export class UpdateWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(command: UpdateWalletCommand): Promise<Wallet> {
    const customer = await this.customerRepository.findOneById(command.customerId);
    
    if (!customer) {
      throw new Error(`Customer with id "${command.customerId}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(command.customerId);

    if (!wallet) {
      throw new Error(`Wallet for customer "${command.customerId}" not found`);
    }

    wallet.updateBalance(command.newBalance);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
