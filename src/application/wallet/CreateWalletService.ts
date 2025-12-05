import { Wallet } from '@domain/wallet';
import { IWalletRepository } from '@domain/wallet';

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
