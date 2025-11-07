import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';

export class DeleteWalletService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.walletRepository.doesExists(id);

    if (!exists) {
      throw new Error(`Wallet with id "${id}" not found`);
    }

    await this.walletRepository.delete(id);
  }
}
