import { Wallet } from '../../domain/wallet/entities/Wallet';
import { IWalletRepository } from '../../domain/wallet/repositories/IWalletRepository';
import { ICustomerRepository } from '../../domain/customer/repositories/ICustomerRepository';
import { Money } from '../../domain/wallet/value-objects/Money';
import { Currency } from '../../domain/wallet/value-objects/Currency';
import { UpdateWalletCommand } from './UpdateWalletCommand';

export class UpdateWalletService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(command: UpdateWalletCommand): Promise<Wallet> {
    const customer = await this.customerRepository.findOneById(command.customerId);
    
    if (!customer) {
      throw new Error(`Customer with id "${command.customerId}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(command.customerId);

    if (!wallet) {
      throw new Error(`Wallet for customer "${command.customerId}" not found`);
    }

    const currencyUpper = command.currency.toUpperCase();
    if (!Object.values(Currency).includes(currencyUpper as Currency)) {
      throw new Error(`Invalid currency: ${command.currency}. Valid currencies: ${Object.values(Currency).join(', ')}`);
    }

    const money = Money.create(command.amount, currencyUpper as Currency);
    wallet.addFunds(money);

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
