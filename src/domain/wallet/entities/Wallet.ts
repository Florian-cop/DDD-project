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
