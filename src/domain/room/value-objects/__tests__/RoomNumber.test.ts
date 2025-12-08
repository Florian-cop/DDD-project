import { RoomNumber } from '../RoomNumber';

describe('RoomNumber Value Object', () => {
  describe('create', () => {
    it('should create a valid numeric room number', () => {
      const roomNumber = RoomNumber.create('101');
      expect(roomNumber.value).toBe('101');
    });

    it('should create a valid alphanumeric room number', () => {
      const roomNumber = RoomNumber.create('A101');
      expect(roomNumber.value).toBe('A101');
    });

    it('should create a valid room number with dash', () => {
      const roomNumber = RoomNumber.create('1-01');
      expect(roomNumber.value).toBe('1-01');
    });

    it('should create a valid room number with letter and dash', () => {
      const roomNumber = RoomNumber.create('A-101');
      expect(roomNumber.value).toBe('A-101');
    });

    it('should convert to uppercase', () => {
      const roomNumber = RoomNumber.create('a-101');
      expect(roomNumber.value).toBe('A-101');
    });

    it('should trim whitespace', () => {
      const roomNumber = RoomNumber.create('  101  ');
      expect(roomNumber.value).toBe('101');
    });

    it('should throw error for empty room number', () => {
      expect(() => RoomNumber.create('')).toThrow('Room number cannot be empty');
    });

    it('should throw error for whitespace-only room number', () => {
      expect(() => RoomNumber.create('   ')).toThrow('Room number cannot be empty');
    });

    it('should throw error for invalid format with special characters', () => {
      expect(() => RoomNumber.create('101@')).toThrow('is not valid');
    });

    it('should throw error for room number that is too long', () => {
      expect(() => RoomNumber.create('ABCD-1234')).toThrow('is not valid');
    });

    it('should throw error for multiple dashes', () => {
      expect(() => RoomNumber.create('1-2-3')).toThrow('is not valid');
    });

    it('should accept single character room numbers', () => {
      const roomNumber = RoomNumber.create('A');
      expect(roomNumber.value).toBe('A');
    });

    it('should accept two character room numbers', () => {
      const roomNumber = RoomNumber.create('A1');
      expect(roomNumber.value).toBe('A1');
    });

    it('should accept three character room numbers', () => {
      const roomNumber = RoomNumber.create('A12');
      expect(roomNumber.value).toBe('A12');
    });
  });

  describe('business rules', () => {
    it('should support floor numbering convention (1-01, 2-05)', () => {
      const firstFloor = RoomNumber.create('1-01');
      const secondFloor = RoomNumber.create('2-05');
      expect(firstFloor.value).toBe('1-01');
      expect(secondFloor.value).toBe('2-05');
    });

    it('should support building wing convention (A-101, B-205)', () => {
      const wingA = RoomNumber.create('A-101');
      const wingB = RoomNumber.create('B-205');
      expect(wingA.value).toBe('A-101');
      expect(wingB.value).toBe('B-205');
    });
  });

  describe('equality', () => {
    it('should consider two room numbers with same value as equal', () => {
      const room1 = RoomNumber.create('101');
      const room2 = RoomNumber.create('101');
      expect(room1.equals(room2)).toBe(true);
    });

    it('should consider room numbers with different case as equal', () => {
      const room1 = RoomNumber.create('a101');
      const room2 = RoomNumber.create('A101');
      expect(room1.equals(room2)).toBe(true);
    });

    it('should consider different room numbers as not equal', () => {
      const room1 = RoomNumber.create('101');
      const room2 = RoomNumber.create('102');
      expect(room1.equals(room2)).toBe(false);
    });
  });
});
