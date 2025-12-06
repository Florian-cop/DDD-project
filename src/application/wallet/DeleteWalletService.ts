import { IWalletRepository } from '@domain/wallet';
import { ICustomerRepository } from '@domain/customer/repositories/ICustomerRepository';
import { DeleteWalletCommand } from './DeleteWalletCommand';

export class DeleteWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(command: DeleteWalletCommand): Promise<void> {
    
    const customer = await this.customerRepository.findOneById(command.customerId);

    if (!customer) {
      throw new Error(`Customer with id "${command.customerId}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(command.customerId);

    if (!wallet) {
      throw new Error(`Wallet for customer "${command.customerId}" not found`);
    }

    await this.walletRepository.delete(wallet.id);
  }
}
