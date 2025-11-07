import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';

export class GetWalletService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOneById(id);

    if (!wallet) {
      throw new Error(`Wallet with id "${id}" not found`);
    }

    return wallet;
  }
}
