import { Wallet } from '../../domain/wallet/index';
import { IWalletRepository } from '../../domain/wallet/index';

export class GetAllWalletsService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(): Promise<Wallet[]> {
    return await this.walletRepository.findAll();
  }
}
