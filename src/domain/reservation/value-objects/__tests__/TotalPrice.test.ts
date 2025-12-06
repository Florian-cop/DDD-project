import { TotalPrice } from '../TotalPrice';

describe('TotalPrice Value Object', () => {
  describe('create', () => {
    it('should create a valid total price in EUR', () => {
      const price = TotalPrice.create(100, 'EUR');
      expect(price.amount).toBe(100);
      expect(price.currency).toBe('EUR');
    });

    it('should use EUR as default currency', () => {
      const price = TotalPrice.create(100);
      expect(price.currency).toBe('EUR');
    });

    it('should convert currency to uppercase', () => {
      const price = TotalPrice.create(100, 'usd');
      expect(price.currency).toBe('USD');
    });

    it('should throw error for negative amount', () => {
      expect(() => TotalPrice.create(-10, 'EUR')).toThrow('Total price cannot be negative');
    });

    it('should throw error for zero amount', () => {
      expect(() => TotalPrice.create(0, 'EUR')).toThrow('Total price cannot be zero');
    });

    it('should throw error for invalid currency', () => {
      expect(() => TotalPrice.create(100, 'XYZ')).toThrow('Invalid currency');
    });

    it('should accept all valid currencies', () => {
      expect(() => TotalPrice.create(100, 'EUR')).not.toThrow();
      expect(() => TotalPrice.create(100, 'USD')).not.toThrow();
      expect(() => TotalPrice.create(100, 'GBP')).not.toThrow();
      expect(() => TotalPrice.create(100, 'JPY')).not.toThrow();
      expect(() => TotalPrice.create(100, 'CHF')).not.toThrow();
    });

    it('should round amount to 2 decimals', () => {
      const price = TotalPrice.create(99.999, 'EUR');
      expect(price.amount).toBe(100);
    });

    it('should handle decimal amounts correctly', () => {
      const price = TotalPrice.create(99.95, 'EUR');
      expect(price.amount).toBe(99.95);
    });
  });

  describe('format', () => {
    it('should format price with 2 decimals', () => {
      const price = TotalPrice.create(100, 'EUR');
      expect(price.format()).toBe('100.00 EUR');
    });

    it('should format decimal price correctly', () => {
      const price = TotalPrice.create(99.99, 'USD');
      expect(price.format()).toBe('99.99 USD');
    });

    it('should add trailing zeros', () => {
      const price = TotalPrice.create(50.5, 'GBP');
      expect(price.format()).toBe('50.50 GBP');
    });

    it('formattedAmount should match format()', () => {
      const price = TotalPrice.create(123.45, 'CHF');
      expect(price.formattedAmount).toBe(price.format());
    });
  });

  describe('add', () => {
    it('should add two prices in same currency', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(50, 'EUR');
      const result = price1.add(price2);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when adding prices with different currencies', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(50, 'USD');
      
      expect(() => price1.add(price2)).toThrow('Cannot add prices with different currencies');
    });

    it('should handle decimal addition', () => {
      const price1 = TotalPrice.create(99.99, 'EUR');
      const price2 = TotalPrice.create(0.01, 'EUR');
      const result = price1.add(price2);
      
      expect(result.amount).toBe(100);
    });
  });

  describe('subtract', () => {
    it('should subtract two prices in same currency', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(30, 'EUR');
      const result = price1.subtract(price2);
      
      expect(result.amount).toBe(70);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when subtracting prices with different currencies', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(50, 'USD');
      
      expect(() => price1.subtract(price2)).toThrow('Cannot subtract prices with different currencies');
    });

    it('should throw error when result would be negative', () => {
      const price1 = TotalPrice.create(50, 'EUR');
      const price2 = TotalPrice.create(100, 'EUR');
      
      expect(() => price1.subtract(price2)).toThrow('Total price cannot be negative');
    });

    it('should throw error when result would be zero', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(100, 'EUR');
      
      expect(() => price1.subtract(price2)).toThrow('Total price cannot be zero');
    });
  });

  describe('multiply', () => {
    it('should multiply price by positive factor', () => {
      const price = TotalPrice.create(50, 'EUR');
      const result = price.multiply(2);
      
      expect(result.amount).toBe(100);
      expect(result.currency).toBe('EUR');
    });

    it('should multiply by decimal factor', () => {
      const price = TotalPrice.create(100, 'EUR');
      const result = price.multiply(0.5);
      
      expect(result.amount).toBe(50);
    });

    it('should throw error for negative factor', () => {
      const price = TotalPrice.create(100, 'EUR');
      expect(() => price.multiply(-2)).toThrow('Cannot multiply by negative factor');
    });

    it('should throw error when multiplying by zero', () => {
      const price = TotalPrice.create(100, 'EUR');
      expect(() => price.multiply(0)).toThrow('Total price cannot be zero');
    });

    it('should handle multiplication resulting in decimals', () => {
      const price = TotalPrice.create(100, 'EUR');
      const result = price.multiply(1.5);
      
      expect(result.amount).toBe(150);
    });
  });

  describe('business rules', () => {
    it('should correctly calculate price for 3 nights at 50 EUR per night', () => {
      const pricePerNight = TotalPrice.create(50, 'EUR');
      const totalPrice = pricePerNight.multiply(3);
      
      expect(totalPrice.amount).toBe(150);
    });

    it('should correctly calculate half price for deposit', () => {
      const totalPrice = TotalPrice.create(200, 'EUR');
      const deposit = totalPrice.multiply(0.5);
      
      expect(deposit.amount).toBe(100);
    });
  });

  describe('equality', () => {
    it('should consider two prices with same amount and currency as equal', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(100, 'EUR');
      
      expect(price1.equals(price2)).toBe(true);
    });

    it('should consider prices with different amounts as not equal', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(50, 'EUR');
      
      expect(price1.equals(price2)).toBe(false);
    });

    it('should consider prices with different currencies as not equal', () => {
      const price1 = TotalPrice.create(100, 'EUR');
      const price2 = TotalPrice.create(100, 'USD');
      
      expect(price1.equals(price2)).toBe(false);
    });
  });
});
