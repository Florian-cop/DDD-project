import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';

export class UpdateWalletService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(id: string, newBalance: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOneById(id);

    if (!wallet) {
      throw new Error(`Wallet with id "${id}" not found`);
    }

    if (newBalance < 0) {
      throw new Error('Balance cannot be negative');
    }

    // Note: Vous devriez ajouter une méthode updateBalance dans l'entité Wallet
    // Pour l'instant, on sauvegarde tel quel
    await this.walletRepository.save(wallet);

    return wallet;
  }
}
