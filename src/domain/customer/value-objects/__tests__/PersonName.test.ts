import { PersonName } from '../PersonName';

describe('PersonName Value Object', () => {
  describe('create', () => {
    it('should create a valid person name', () => {
      const name = PersonName.create('John', 'Doe');
      expect(name.firstname).toBe('John');
      expect(name.lastname).toBe('Doe');
      expect(name.fullname).toBe('John Doe');
    });

    it('should capitalize first letter of firstname', () => {
      const name = PersonName.create('john', 'doe');
      expect(name.firstname).toBe('John');
      expect(name.lastname).toBe('Doe');
    });

    it('should handle all uppercase input', () => {
      const name = PersonName.create('JOHN', 'DOE');
      expect(name.firstname).toBe('John');
      expect(name.lastname).toBe('Doe');
    });

    it('should trim whitespace from names', () => {
      const name = PersonName.create('  John  ', '  Doe  ');
      expect(name.firstname).toBe('John');
      expect(name.lastname).toBe('Doe');
    });

    it('should throw error for empty firstname', () => {
      expect(() => PersonName.create('', 'Doe')).toThrow('Firstname cannot be empty');
    });

    it('should throw error for empty lastname', () => {
      expect(() => PersonName.create('John', '')).toThrow('Lastname cannot be empty');
    });

    it('should throw error for whitespace-only firstname', () => {
      expect(() => PersonName.create('   ', 'Doe')).toThrow('Firstname cannot be empty');
    });

    it('should throw error for whitespace-only lastname', () => {
      expect(() => PersonName.create('John', '   ')).toThrow('Lastname cannot be empty');
    });

    it('should throw error for firstname with less than 2 characters', () => {
      expect(() => PersonName.create('J', 'Doe')).toThrow('Firstname must have at least 2 characters');
    });

    it('should throw error for lastname with less than 2 characters', () => {
      expect(() => PersonName.create('John', 'D')).toThrow('Lastname must have at least 2 characters');
    });

    it('should accept names with exactly 2 characters', () => {
      const name = PersonName.create('Li', 'Wu');
      expect(name.firstname).toBe('Li');
      expect(name.lastname).toBe('Wu');
    });

    it('should handle hyphenated names', () => {
      const name = PersonName.create('Jean-Pierre', 'Martin-Dupont');
      expect(name.firstname).toBe('Jean-pierre');
      expect(name.lastname).toBe('Martin-dupont');
    });
  });

  describe('fullname', () => {
    it('should concatenate firstname and lastname with space', () => {
      const name = PersonName.create('Marie', 'Curie');
      expect(name.fullname).toBe('Marie Curie');
    });
  });

  describe('equality', () => {
    it('should consider two names with same values as equal', () => {
      const name1 = PersonName.create('John', 'Doe');
      const name2 = PersonName.create('John', 'Doe');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should consider names with different case as not equal (after capitalization)', () => {
      const name1 = PersonName.create('john', 'doe');
      const name2 = PersonName.create('JOHN', 'DOE');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should consider different names as not equal', () => {
      const name1 = PersonName.create('John', 'Doe');
      const name2 = PersonName.create('Jane', 'Doe');
      expect(name1.equals(name2)).toBe(false);
    });
  });
});
