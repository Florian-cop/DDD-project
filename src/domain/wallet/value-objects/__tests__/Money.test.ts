import { Money } from '../Money';
import { Currency } from '../Currency';

describe('Money Value Object', () => {
  describe('create', () => {
    it('should create money with valid amount and currency', () => {
      const money = Money.create(100, Currency.EUR);
      expect(money.amount).toBe(100);
      expect(money.currency).toBe(Currency.EUR);
    });

    it('should create money with zero amount', () => {
      const money = Money.create(0, Currency.EUR);
      expect(money.amount).toBe(0);
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.create(-10, Currency.EUR)).toThrow('Amount cannot be negative');
    });

    it('should accept decimal amounts', () => {
      const money = Money.create(99.99, Currency.EUR);
      expect(money.amount).toBe(99.99);
    });

    it('should create money with all supported currencies', () => {
      expect(() => Money.create(100, Currency.EUR)).not.toThrow();
      expect(() => Money.create(100, Currency.USD)).not.toThrow();
      expect(() => Money.create(100, Currency.GBP)).not.toThrow();
      expect(() => Money.create(100, Currency.JPY)).not.toThrow();
      expect(() => Money.create(100, Currency.CHF)).not.toThrow();
    });
  });

  describe('zero', () => {
    it('should create zero money in EUR by default', () => {
      const money = Money.zero();
      expect(money.amount).toBe(0);
      expect(money.currency).toBe(Currency.EUR);
    });

    it('should create zero money in specified currency', () => {
      const money = Money.zero(Currency.USD);
      expect(money.amount).toBe(0);
      expect(money.currency).toBe(Currency.USD);
    });
  });

  describe('toEuros', () => {
    it('should return same amount for EUR', () => {
      const money = Money.create(100, Currency.EUR);
      expect(money.toEuros()).toBe(100);
    });

    it('should convert USD to EUR', () => {
      const money = Money.create(100, Currency.USD);
      expect(money.toEuros()).toBe(92); // 100 * 0.92
    });

    it('should convert GBP to EUR', () => {
      const money = Money.create(100, Currency.GBP);
      expect(money.toEuros()).toBe(117); // 100 * 1.17
    });

    it('should convert JPY to EUR', () => {
      const money = Money.create(1000, Currency.JPY);
      expect(money.toEuros()).toBe(6.3); // 1000 * 0.0063
    });

    it('should convert CHF to EUR', () => {
      const money = Money.create(100, Currency.CHF);
      expect(money.toEuros()).toBe(106); // 100 * 1.06
    });
  });

  describe('add', () => {
    it('should add two amounts in same currency', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(50, Currency.EUR);
      const result = money1.add(money2);
      expect(result.amount).toBe(150);
      expect(result.currency).toBe(Currency.EUR);
    });

    it('should add amounts in different currencies and return EUR', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(100, Currency.USD); // 92 EUR
      const result = money1.add(money2);
      expect(result.amount).toBe(192);
      expect(result.currency).toBe(Currency.EUR);
    });

    it('should add zero to amount', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.zero(Currency.EUR);
      const result = money1.add(money2);
      expect(result.amount).toBe(100);
    });
  });

  describe('subtract', () => {
    it('should subtract two amounts in same currency', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(30, Currency.EUR);
      const result = money1.subtract(money2);
      expect(result.amount).toBe(70);
      expect(result.currency).toBe(Currency.EUR);
    });

    it('should throw error when result is negative', () => {
      const money1 = Money.create(50, Currency.EUR);
      const money2 = Money.create(100, Currency.EUR);
      expect(() => money1.subtract(money2)).toThrow('Result cannot be negative');
    });

    it('should return zero when subtracting equal amounts', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(100, Currency.EUR);
      const result = money1.subtract(money2);
      expect(result.amount).toBe(0);
    });
  });

  describe('multiply', () => {
    it('should multiply amount by positive factor', () => {
      const money = Money.create(50, Currency.EUR);
      const result = money.multiply(2);
      expect(result.amount).toBe(100);
      expect(result.currency).toBe(Currency.EUR);
    });

    it('should multiply by decimal factor', () => {
      const money = Money.create(100, Currency.EUR);
      const result = money.multiply(0.5);
      expect(result.amount).toBe(50);
    });

    it('should multiply by zero', () => {
      const money = Money.create(100, Currency.EUR);
      const result = money.multiply(0);
      expect(result.amount).toBe(0);
    });

    it('should throw error for negative factor', () => {
      const money = Money.create(100, Currency.EUR);
      expect(() => money.multiply(-2)).toThrow('Factor cannot be negative');
    });
  });

  describe('divide', () => {
    it('should divide amount by positive divisor', () => {
      const money = Money.create(100, Currency.EUR);
      const result = money.divide(2);
      expect(result.amount).toBe(50);
      expect(result.currency).toBe(Currency.EUR);
    });

    it('should divide by decimal divisor', () => {
      const money = Money.create(100, Currency.EUR);
      const result = money.divide(0.5);
      expect(result.amount).toBe(200);
    });

    it('should throw error when dividing by zero', () => {
      const money = Money.create(100, Currency.EUR);
      expect(() => money.divide(0)).toThrow('Divisor must be positive');
    });

    it('should throw error when dividing by negative number', () => {
      const money = Money.create(100, Currency.EUR);
      expect(() => money.divide(-2)).toThrow('Divisor must be positive');
    });
  });

  describe('comparison methods', () => {
    it('isGreaterThan should compare two amounts', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(50, Currency.EUR);
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isGreaterThan(money1)).toBe(false);
    });

    it('isGreaterThanOrEqual should compare two amounts', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(100, Currency.EUR);
      const money3 = Money.create(50, Currency.EUR);
      expect(money1.isGreaterThanOrEqual(money2)).toBe(true);
      expect(money1.isGreaterThanOrEqual(money3)).toBe(true);
      expect(money3.isGreaterThanOrEqual(money1)).toBe(false);
    });

    it('isLessThan should compare two amounts', () => {
      const money1 = Money.create(50, Currency.EUR);
      const money2 = Money.create(100, Currency.EUR);
      expect(money1.isLessThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(false);
    });

    it('should compare amounts in different currencies', () => {
      const moneyEur = Money.create(100, Currency.EUR);
      const moneyUsd = Money.create(100, Currency.USD); // 92 EUR
      expect(moneyEur.isGreaterThan(moneyUsd)).toBe(true);
    });
  });

  describe('format', () => {
    it('should format EUR with 2 decimals', () => {
      const money = Money.create(99.99, Currency.EUR);
      expect(money.format()).toBe('99.99 EUR');
    });

    it('should format USD with 2 decimals', () => {
      const money = Money.create(150.5, Currency.USD);
      expect(money.format()).toBe('150.50 USD');
    });

    it('should format whole numbers with .00', () => {
      const money = Money.create(100, Currency.EUR);
      expect(money.format()).toBe('100.00 EUR');
    });
  });

  describe('equality', () => {
    it('should consider two money objects with same amount and currency as equal', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(100, Currency.EUR);
      expect(money1.equals(money2)).toBe(true);
    });

    it('should consider money with different amounts as not equal', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(50, Currency.EUR);
      expect(money1.equals(money2)).toBe(false);
    });

    it('should consider money with different currencies as not equal', () => {
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(100, Currency.USD);
      expect(money1.equals(money2)).toBe(false);
    });
  });
});
