import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';

export class GetAllWalletsService {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(): Promise<Wallet[]> {
    return await this.walletRepository.findAll();
  }
}
