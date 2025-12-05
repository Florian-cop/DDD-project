import { Email } from '../../..';
import { Entity } from '../../../core/Entity';

export interface IWalletProps {
  balance: number;
  idCustomer: string;
}

export class Wallet extends Entity<IWalletProps> {
  private _balance: number;
  private _idCustomer: string;

  private constructor(props: IWalletProps, id?: string) {
    super(id);
    this._balance = props.balance;
    this._idCustomer = props.idCustomer;
  }

  get balance(): number {
    return this._balance;
  }

  get idCustomer(): string {
    return this._idCustomer;
  }

  public updateBalance(newBalance: number): void {
    if (newBalance < 0) {
      throw new Error('Balance cannot be negative');
    }
    this._balance = newBalance;
  }

  public addToBalance(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount to add must be positive');
    }
    this._balance += amount;
  }

  public deductFromBalance(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount to deduct must be positive');
    }
    if (this._balance < amount) {
      throw new Error('Insufficient balance');
    }
    this._balance -= amount;
  }

    public static create(
      idCustomer: string,
      id?: string
    ): Wallet {
      return new Wallet(
        {
          balance: 0,
          idCustomer
        },
        id
      );
    }
}
