import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';
import { ICustomerRepository } from '../../domain/customer/repositories/ICustomerRepository';
import { DeleteWalletCommand } from './DeleteWalletCommand';

export class DeleteWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(command: DeleteWalletCommand): Promise<void> {
    // Vérifier que le customer existe
    const customer = await this.customerRepository.findOneById(command.customerId);

    if (!customer) {
      throw new Error(`Customer with id "${command.customerId}" not found`);
    }

    // Trouver le wallet du customer
    const wallet = await this.walletRepository.findByCustomerId(command.customerId);

    if (!wallet) {
      throw new Error(`Wallet for customer "${command.customerId}" not found`);
    }

    await this.walletRepository.delete(wallet.id);
  }
}
