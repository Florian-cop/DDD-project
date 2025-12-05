import { ValueObject } from '../../../core/ValueObject';
import { Currency } from './Currency';

interface IMoneyProps {
  amount: number;
  currency: Currency;
}

export class Money extends ValueObject<IMoneyProps> {
  private static readonly CONVERSION_RATES: Record<Currency, number> = {
    [Currency.EUR]: 1,
    [Currency.USD]: 0.92,
    [Currency.GBP]: 1.17,
    [Currency.JPY]: 0.0063,
    [Currency.CHF]: 1.06
  };

  get amount(): number {
    return this.props.amount;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  public toEuros(): number {
    const conversionRate = Money.CONVERSION_RATES[this.props.currency];
    return this.props.amount * conversionRate;
  }

  public add(other: Money): Money {
    const thisInEuros = this.toEuros();
    const otherInEuros = other.toEuros();
    return Money.create(thisInEuros + otherInEuros, Currency.EUR);
  }

  public subtract(other: Money): Money {
    const thisInEuros = this.toEuros();
    const otherInEuros = other.toEuros();
    const result = thisInEuros - otherInEuros;
    
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    
    return Money.create(result, Currency.EUR);
  }

  public isGreaterThan(other: Money): boolean {
    return this.toEuros() > other.toEuros();
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    return this.toEuros() >= other.toEuros();
  }

  public isLessThan(other: Money): boolean {
    return this.toEuros() < other.toEuros();
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return Money.create(this.props.amount * factor, this.props.currency);
  }

  public divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new Error('Divisor must be positive');
    }
    return Money.create(this.props.amount / divisor, this.props.currency);
  }

  public format(): string {
    return `${this.props.amount.toFixed(2)} ${this.props.currency}`;
  }

  public static create(amount: number, currency: Currency): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!Object.values(Currency).includes(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }

    return new Money({ amount, currency });
  }

  public static zero(currency: Currency = Currency.EUR): Money {
    return Money.create(0, currency);
  }

  public static fromEuros(amountInEuros: number, targetCurrency: Currency): Money {
    if (amountInEuros < 0) {
      throw new Error('Amount cannot be negative');
    }

    const conversionRate = Money.CONVERSION_RATES[targetCurrency];
    const convertedAmount = amountInEuros / conversionRate;
    
    return Money.create(convertedAmount, targetCurrency);
  }
}
