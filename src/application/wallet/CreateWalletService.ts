import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';

export class CreateWalletService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(idCustomer: string): Promise<Wallet> {

    const wallet = Wallet.create(
      idCustomer
    );

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
