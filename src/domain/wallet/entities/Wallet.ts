import { Entity } from '../../../core/Entity';
import { Money } from '../value-objects/Money';
import { Currency } from '../value-objects/Currency';

export interface IWalletProps {
  balanceInEuros: number;
  idCustomer: string;
}

export class Wallet extends Entity<IWalletProps> {
  private _balanceInEuros: number;
  private _idCustomer: string;

  private constructor(props: IWalletProps, id?: string) {
    super(id);
    this._balanceInEuros = props.balanceInEuros;
    this._idCustomer = props.idCustomer;
  }

  get balanceInEuros(): number {
    return this._balanceInEuros;
  }

  get balance(): number {
    return this._balanceInEuros;
  }

  get idCustomer(): string {
    return this._idCustomer;
  }

  public addFunds(money: Money): void {
    const amountInEuros = money.toEuros();
    
    if (amountInEuros <= 0) {
      throw new Error('Amount to add must be positive');
    }
    
    this._balanceInEuros += amountInEuros;
  }

  public deduct(money: Money): void {
    const amountInEuros = money.toEuros();
    
    if (amountInEuros <= 0) {
      throw new Error('Amount to deduct must be positive');
    }
    
    if (this._balanceInEuros < amountInEuros) {
      throw new Error('Insufficient balance');
    }
    
    this._balanceInEuros -= amountInEuros;
  }

  public hasSufficientFunds(money: Money): boolean {
    return this._balanceInEuros >= money.toEuros();
  }

  public getBalanceAsMoney(): Money {
    return Money.create(this._balanceInEuros, Currency.EUR);
  }

  public static create(
    idCustomer: string,
    id?: string
  ): Wallet {
    return new Wallet(
      {
        balanceInEuros: 0,
        idCustomer
      },
      id
    );
  }
}
