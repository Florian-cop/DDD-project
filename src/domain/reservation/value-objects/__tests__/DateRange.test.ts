import { DateRange } from '../DateRange';

describe('DateRange Value Object', () => {
  // Helper pour créer des dates futures
  const createFutureDate = (daysFromNow: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(12, 0, 0, 0);
    return date;
  };

  describe('create', () => {
    it('should create a valid date range', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(3);
      const dateRange = DateRange.create(checkIn, checkOut);
      
      expect(dateRange.checkInDate).toEqual(checkIn);
      expect(dateRange.checkOutDate).toEqual(checkOut);
    });

    it('should calculate correct number of nights', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(4);
      const dateRange = DateRange.create(checkIn, checkOut);
      
      expect(dateRange.numberOfNights).toBe(3);
    });

    it('should throw error when check-in is after check-out', () => {
      const checkIn = createFutureDate(5);
      const checkOut = createFutureDate(2);
      
      expect(() => DateRange.create(checkIn, checkOut))
        .toThrow('Check-in date must be before check-out date');
    });

    it('should throw error when check-in equals check-out', () => {
      const date = createFutureDate(1);
      
      expect(() => DateRange.create(date, date))
        .toThrow('Check-in date must be before check-out date');
    });

    it('should throw error for past check-in date', () => {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() - 1);
      const checkOut = createFutureDate(2);
      
      expect(() => DateRange.create(checkIn, checkOut))
        .toThrow('Check-in date cannot be in the past');
    });

    it('should allow check-in for today', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(() => DateRange.create(today, tomorrow)).not.toThrow();
    });

    it('should throw error for reservation exceeding 30 nights', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(32);
      
      expect(() => DateRange.create(checkIn, checkOut))
        .toThrow('Reservation cannot exceed 30 nights');
    });

    it('should allow reservation of exactly 30 nights', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(31);
      
      expect(() => DateRange.create(checkIn, checkOut)).not.toThrow();
    });

    it('should allow minimum 1 night reservation', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(2);
      const dateRange = DateRange.create(checkIn, checkOut);
      
      expect(dateRange.numberOfNights).toBe(1);
    });
  });

  describe('numberOfNights', () => {
    it('should calculate 1 night correctly', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(2);
      const dateRange = DateRange.create(checkIn, checkOut);
      
      expect(dateRange.numberOfNights).toBe(1);
    });

    it('should calculate 7 nights correctly', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(8);
      const dateRange = DateRange.create(checkIn, checkOut);
      
      expect(dateRange.numberOfNights).toBe(7);
    });
  });

  describe('overlaps', () => {
    it('should detect overlapping date ranges', () => {
      const range1 = DateRange.create(createFutureDate(1), createFutureDate(5));
      const range2 = DateRange.create(createFutureDate(3), createFutureDate(7));
      
      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('should not detect overlap for non-overlapping ranges', () => {
      const range1 = DateRange.create(createFutureDate(1), createFutureDate(3));
      const range2 = DateRange.create(createFutureDate(5), createFutureDate(7));
      
      expect(range1.overlaps(range2)).toBe(false);
      expect(range2.overlaps(range1)).toBe(false);
    });

    it('should not detect overlap for adjacent ranges', () => {
      const range1 = DateRange.create(createFutureDate(1), createFutureDate(3));
      const range2 = DateRange.create(createFutureDate(3), createFutureDate(5));
      
      expect(range1.overlaps(range2)).toBe(false);
    });

    it('should detect when one range contains another', () => {
      const range1 = DateRange.create(createFutureDate(1), createFutureDate(10));
      const range2 = DateRange.create(createFutureDate(3), createFutureDate(5));
      
      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });
  });

  describe('includes', () => {
    it('should return true for date within range', () => {
      const dateRange = DateRange.create(createFutureDate(1), createFutureDate(5));
      const dateInRange = createFutureDate(3);
      
      expect(dateRange.includes(dateInRange)).toBe(true);
    });

    it('should return true for check-in date', () => {
      const checkIn = createFutureDate(1);
      const dateRange = DateRange.create(checkIn, createFutureDate(5));
      
      expect(dateRange.includes(checkIn)).toBe(true);
    });

    it('should return false for check-out date', () => {
      const checkOut = createFutureDate(5);
      const dateRange = DateRange.create(createFutureDate(1), checkOut);
      
      expect(dateRange.includes(checkOut)).toBe(false);
    });

    it('should return false for date before range', () => {
      const dateRange = DateRange.create(createFutureDate(5), createFutureDate(10));
      const dateBefore = createFutureDate(2);
      
      expect(dateRange.includes(dateBefore)).toBe(false);
    });

    it('should return false for date after range', () => {
      const dateRange = DateRange.create(createFutureDate(1), createFutureDate(5));
      const dateAfter = createFutureDate(10);
      
      expect(dateRange.includes(dateAfter)).toBe(false);
    });
  });

  describe('time-based checks', () => {
    it('isInFuture should return true for future date range', () => {
      const dateRange = DateRange.create(createFutureDate(1), createFutureDate(5));
      expect(dateRange.isInFuture()).toBe(true);
    });

    it('isPast should return false for future date range', () => {
      const dateRange = DateRange.create(createFutureDate(1), createFutureDate(5));
      expect(dateRange.isPast()).toBe(false);
    });
  });

  describe('equality', () => {
    it('should consider two date ranges with same dates as equal', () => {
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(5);
      const range1 = DateRange.create(checkIn, checkOut);
      const range2 = DateRange.create(checkIn, checkOut);
      
      expect(range1.equals(range2)).toBe(true);
    });

    it('should consider different date ranges as not equal', () => {
      const range1 = DateRange.create(createFutureDate(1), createFutureDate(5));
      const range2 = DateRange.create(createFutureDate(2), createFutureDate(6));
      
      expect(range1.equals(range2)).toBe(false);
    });
  });
});
