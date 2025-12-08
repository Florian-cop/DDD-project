import { ReservationStatus, ReservationStatusEnum } from '../ReservationStatus';

describe('ReservationStatus Value Object', () => {
  describe('create', () => {
    it('should create BOOKED status', () => {
      const status = ReservationStatus.create(ReservationStatusEnum.BOOKED);
      expect(status.status).toBe(ReservationStatusEnum.BOOKED);
      expect(status.label).toBe('Booked');
    });

    it('should create CONFIRMED status', () => {
      const status = ReservationStatus.create(ReservationStatusEnum.CONFIRMED);
      expect(status.status).toBe(ReservationStatusEnum.CONFIRMED);
      expect(status.label).toBe('Confirmed');
    });

    it('should create CANCELLED status', () => {
      const status = ReservationStatus.create(ReservationStatusEnum.CANCELLED);
      expect(status.status).toBe(ReservationStatusEnum.CANCELLED);
      expect(status.label).toBe('Cancelled');
    });
  });

  describe('factory methods', () => {
    it('should create booked status', () => {
      const status = ReservationStatus.createBooked();
      expect(status.status).toBe(ReservationStatusEnum.BOOKED);
      expect(status.isBooked()).toBe(true);
    });

    it('should create confirmed status', () => {
      const status = ReservationStatus.createConfirmed();
      expect(status.status).toBe(ReservationStatusEnum.CONFIRMED);
      expect(status.isConfirmed()).toBe(true);
    });

    it('should create cancelled status', () => {
      const status = ReservationStatus.createCancelled();
      expect(status.status).toBe(ReservationStatusEnum.CANCELLED);
      expect(status.isCancelled()).toBe(true);
    });
  });

  describe('status checks', () => {
    it('should correctly identify booked status', () => {
      const status = ReservationStatus.createBooked();
      expect(status.isBooked()).toBe(true);
      expect(status.isConfirmed()).toBe(false);
      expect(status.isCancelled()).toBe(false);
    });

    it('should correctly identify confirmed status', () => {
      const status = ReservationStatus.createConfirmed();
      expect(status.isBooked()).toBe(false);
      expect(status.isConfirmed()).toBe(true);
      expect(status.isCancelled()).toBe(false);
    });

    it('should correctly identify cancelled status', () => {
      const status = ReservationStatus.createCancelled();
      expect(status.isBooked()).toBe(false);
      expect(status.isConfirmed()).toBe(false);
      expect(status.isCancelled()).toBe(true);
    });
  });

  describe('transition rules (business logic)', () => {
    it('should allow confirmation only from BOOKED status', () => {
      const bookedStatus = ReservationStatus.createBooked();
      expect(bookedStatus.canBeConfirmed()).toBe(true);

      const confirmedStatus = ReservationStatus.createConfirmed();
      expect(confirmedStatus.canBeConfirmed()).toBe(false);

      const cancelledStatus = ReservationStatus.createCancelled();
      expect(cancelledStatus.canBeConfirmed()).toBe(false);
    });

    it('should allow cancellation from BOOKED status', () => {
      const bookedStatus = ReservationStatus.createBooked();
      expect(bookedStatus.canBeCancelled()).toBe(true);
    });

    it('should allow cancellation from CONFIRMED status', () => {
      const confirmedStatus = ReservationStatus.createConfirmed();
      expect(confirmedStatus.canBeCancelled()).toBe(true);
    });

    it('should not allow cancellation from CANCELLED status', () => {
      const cancelledStatus = ReservationStatus.createCancelled();
      expect(cancelledStatus.canBeCancelled()).toBe(false);
    });
  });

  describe('equality', () => {
    it('should consider two statuses with same value as equal', () => {
      const status1 = ReservationStatus.createBooked();
      const status2 = ReservationStatus.createBooked();
      expect(status1.equals(status2)).toBe(true);
    });

    it('should consider different statuses as not equal', () => {
      const status1 = ReservationStatus.createBooked();
      const status2 = ReservationStatus.createConfirmed();
      expect(status1.equals(status2)).toBe(false);
    });
  });
});
