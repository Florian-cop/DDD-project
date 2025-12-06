import { Email } from '../Email';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should convert email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace from email', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow('Email "invalid-email" is not valid');
    });

    it('should throw error for email without @', () => {
      expect(() => Email.create('testexample.com')).toThrow();
    });

    it('should throw error for email without domain', () => {
      expect(() => Email.create('test@')).toThrow();
    });

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow();
    });

    it('should accept email with subdomain', () => {
      const email = Email.create('test@mail.example.com');
      expect(email.value).toBe('test@mail.example.com');
    });

    it('should accept email with numbers', () => {
      const email = Email.create('user123@example.com');
      expect(email.value).toBe('user123@example.com');
    });

    it('should accept email with dots and dashes', () => {
      const email = Email.create('user.name-test@example.com');
      expect(email.value).toBe('user.name-test@example.com');
    });
  });

  describe('equality', () => {
    it('should consider two emails with same value as equal', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should consider emails with different case as equal', () => {
      const email1 = Email.create('TEST@example.com');
      const email2 = Email.create('test@EXAMPLE.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should consider different emails as not equal', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
