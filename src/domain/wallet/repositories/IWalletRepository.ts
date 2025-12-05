import { IRepository } from '../../../core/IRepository'
import { Wallet } from '../entities/Wallet';

export interface IWalletRepository extends IRepository<Wallet> {
  findByCustomerId(customerId: string): Promise<Wallet | null>;
}
