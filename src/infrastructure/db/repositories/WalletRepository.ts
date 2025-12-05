import { PrismaClient } from '@prisma/client';
import { IWalletRepository } from '../../../domain/wallet/repositories/IWalletRepository';
import { Wallet } from '../../../domain/wallet/entities/Wallet';

export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany();
    
    return wallets.map((wallet) =>
      Wallet.create(
        wallet.customerId,
        wallet.id
      )
    );
  }

  async findOneById(id: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id }
    });

    if (!wallet) {
      return null;
    }

    return Wallet.create(
      wallet.customerId,
      wallet.id
    );
  }

  async findByCustomerId(customerId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { customerId: customerId }
    });

    if (!wallet) {
      return null;
    }

    return Wallet.create(
      wallet.customerId,
      wallet.id
    );
  }

  async doesExists(id: string): Promise<boolean> {
    const count = await this.prisma.wallet.count({
      where: { id }
    });

    return count > 0;
  }

  async save(entity: Wallet): Promise<void> {
    await this.prisma.wallet.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        balance: entity.balance,
        customerId: entity.idCustomer
      },
      update: {
        balance: entity.balance,
        customerId: entity.idCustomer
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.wallet.delete({
      where: { id }
    });
  }
}
