import { PhoneNumber } from '../PhoneNumber';

describe('PhoneNumber Value Object', () => {
  describe('create', () => {
    it('should create a valid French phone number starting with 0', () => {
      const phone = PhoneNumber.create('0612345678');
      expect(phone.value).toBe('0612345678');
    });

    it('should create a valid French phone number with +33', () => {
      const phone = PhoneNumber.create('+33612345678');
      expect(phone.value).toBe('+33612345678');
    });

    it('should remove spaces from phone number', () => {
      const phone = PhoneNumber.create('06 12 34 56 78');
      expect(phone.value).toBe('0612345678');
    });

    it('should remove dashes from phone number', () => {
      const phone = PhoneNumber.create('06-12-34-56-78');
      expect(phone.value).toBe('0612345678');
    });

    it('should remove parentheses from phone number', () => {
      const phone = PhoneNumber.create('(06) 12 34 56 78');
      expect(phone.value).toBe('0612345678');
    });

    it('should accept international phone numbers', () => {
      const phone = PhoneNumber.create('+15551234567');
      expect(phone.value).toBe('+15551234567');
    });

    it('should throw error for invalid French phone number', () => {
      expect(() => PhoneNumber.create('0012345678')).toThrow('Phone number "0012345678" is not valid');
    });

    it('should throw error for phone number that is too short', () => {
      expect(() => PhoneNumber.create('061234')).toThrow();
    });

    it('should throw error for phone number that is too long', () => {
      expect(() => PhoneNumber.create('+3361234567890123456')).toThrow();
    });

    it('should throw error for empty phone number', () => {
      expect(() => PhoneNumber.create('')).toThrow();
    });

    it('should throw error for phone number with letters', () => {
      expect(() => PhoneNumber.create('06abcd5678')).toThrow();
    });

    it('should accept all French mobile prefixes (06, 07)', () => {
      const phone1 = PhoneNumber.create('0612345678');
      const phone2 = PhoneNumber.create('0712345678');
      expect(phone1.value).toBe('0612345678');
      expect(phone2.value).toBe('0712345678');
    });

    it('should accept French landline numbers', () => {
      const phone = PhoneNumber.create('0145678901');
      expect(phone.value).toBe('0145678901');
    });
  });

  describe('format', () => {
    it('should format French phone number starting with 0', () => {
      const phone = PhoneNumber.create('0612345678');
      expect(phone.format()).toBe('06 12 34 56 78');
    });

    it('should format French phone number with +33', () => {
      const phone = PhoneNumber.create('+33612345678');
      expect(phone.format()).toBe('+33 6 12 34 56 78');
    });

    it('should return unformatted for other international numbers', () => {
      const phone = PhoneNumber.create('+15551234567');
      expect(phone.format()).toBe('+15551234567');
    });
  });

  describe('equality', () => {
    it('should consider two phone numbers with same value as equal', () => {
      const phone1 = PhoneNumber.create('0612345678');
      const phone2 = PhoneNumber.create('06 12 34 56 78');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should consider different phone numbers as not equal', () => {
      const phone1 = PhoneNumber.create('0612345678');
      const phone2 = PhoneNumber.create('0698765432');
      expect(phone1.equals(phone2)).toBe(false);
    });
  });
});
