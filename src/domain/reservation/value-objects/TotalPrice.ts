import { ValueObject } from '../../../core/ValueObject';

interface ITotalPriceProps {
  amount: number;
  currency: string;
}

export class TotalPrice extends ValueObject<ITotalPriceProps> {
  private constructor(props: ITotalPriceProps) {
    super(props);
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get formattedAmount(): string {
    return `${this.props.amount.toFixed(2)} ${this.props.currency}`;
  }

  public format(): string {
    return this.formattedAmount;
  }

  public static create(amount: number, currency: string = 'EUR'): TotalPrice {
    if (amount < 0) {
      throw new Error('Total price cannot be negative');
    }

    if (amount === 0) {
      throw new Error('Total price cannot be zero');
    }

    // Validation de la devise
    const validCurrencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];
    if (!validCurrencies.includes(currency.toUpperCase())) {
      throw new Error(`Invalid currency: ${currency}. Valid currencies: ${validCurrencies.join(', ')}`);
    }

    // Arrondir à 2 décimales
    const roundedAmount = Math.round(amount * 100) / 100;

    return new TotalPrice({ 
      amount: roundedAmount, 
      currency: currency.toUpperCase() 
    });
  }

  public add(other: TotalPrice): TotalPrice {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return TotalPrice.create(this.props.amount + other.amount, this.props.currency);
  }

  public subtract(other: TotalPrice): TotalPrice {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot subtract prices with different currencies');
    }
    return TotalPrice.create(this.props.amount - other.amount, this.props.currency);
  }

  public multiply(factor: number): TotalPrice {
    if (factor < 0) {
      throw new Error('Cannot multiply by negative factor');
    }
    return TotalPrice.create(this.props.amount * factor, this.props.currency);
  }
}
