import { Reservation } from '../Reservation';
import { ReservationStatus } from '../../value-objects/ReservationStatus';
import { TotalPrice } from '../../value-objects/TotalPrice';

describe('Reservation Entity', () => {
  const createFutureDate = (daysFromNow: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(12, 0, 0, 0);
    return date;
  };

  describe('create', () => {
    it('should create a valid reservation', () => {
      const customerId = 'customer-123';
      const roomIds = ['room-1', 'room-2'];
      const checkIn = createFutureDate(1);
      const checkOut = createFutureDate(4);
      const totalPrice = 300;

      const reservation = Reservation.create(
        customerId,
        roomIds,
        checkIn,
        checkOut,
        totalPrice
      );

      expect(reservation.customerId).toBe(customerId);
      expect(reservation.checkInDate).toEqual(checkIn);
      expect(reservation.checkOutDate).toEqual(checkOut);
      expect(reservation.totalPrice.amount).toBe(300);
      expect(reservation.numberOfNights).toBe(3);
      expect(reservation.status.isBooked()).toBe(true);
      expect(reservation.id).toBeDefined();
    });

    it('should create reservation with specific ID', () => {
      const reservationId = 'reservation-123';
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100,
        'EUR',
        reservationId
      );

      expect(reservation.id).toBe(reservationId);
    });

    it('should create reservation with custom currency', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100,
        'USD'
      );

      expect(reservation.totalPrice.currency).toBe('USD');
    });

    it('should throw error for empty customer ID', () => {
      expect(() => Reservation.create(
        '',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      )).toThrow('Customer ID is required');
    });

    it('should throw error for whitespace-only customer ID', () => {
      expect(() => Reservation.create(
        '   ',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      )).toThrow('Customer ID is required');
    });

    it('should trim customer ID', () => {
      const reservation = Reservation.create(
        '  customer-123  ',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      expect(reservation.customerId).toBe('customer-123');
    });

    it('should set reservation date to now', () => {
      const beforeCreation = new Date();
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );
      const afterCreation = new Date();

      expect(reservation.reservationDate.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(reservation.reservationDate.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe('status management', () => {
    it('should start with BOOKED status', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      expect(reservation.status.isBooked()).toBe(true);
      expect(reservation.status.isConfirmed()).toBe(false);
      expect(reservation.status.isCancelled()).toBe(false);
    });

    it('should confirm booked reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm();

      expect(reservation.status.isConfirmed()).toBe(true);
      expect(reservation.status.isBooked()).toBe(false);
    });

    it('should throw error when confirming non-booked reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm();

      expect(() => reservation.confirm())
        .toThrow('Reservation cannot be confirmed in current status');
    });

    it('should cancel booked reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      expect(reservation.status.isCancelled()).toBe(true);
    });

    it('should cancel confirmed reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm();
      reservation.cancel();

      expect(reservation.status.isCancelled()).toBe(true);
    });

    it('should throw error when cancelling already cancelled reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      expect(() => reservation.cancel())
        .toThrow('Reservation cannot be cancelled in current status');
    });
  });

  describe('room management', () => {
    it('should add room to reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.addRoom('room-2');

      expect(reservation.roomIds.ids).toContain('room-1');
      expect(reservation.roomIds.ids).toContain('room-2');
    });

    it('should remove room from reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1', 'room-2'],
        createFutureDate(1),
        createFutureDate(2),
        200
      );

      reservation.removeRoom('room-2');

      expect(reservation.roomIds.ids).toContain('room-1');
      expect(reservation.roomIds.ids).not.toContain('room-2');
    });
  });

  describe('price management', () => {
    it('should update total price', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const newPrice = TotalPrice.create(150, 'EUR');
      reservation.updateTotalPrice(newPrice);

      expect(reservation.totalPrice.amount).toBe(150);
    });

    it('should throw error when updating price of cancelled reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      const newPrice = TotalPrice.create(150, 'EUR');

      expect(() => reservation.updateTotalPrice(newPrice))
        .toThrow('Cannot update price of cancelled reservation');
    });
  });

  describe('date management', () => {
    it('should change dates of booked reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(3),
        100
      );

      const newCheckIn = createFutureDate(5);
      const newCheckOut = createFutureDate(8);

      reservation.changeDates(newCheckIn, newCheckOut);

      expect(reservation.checkInDate).toEqual(newCheckIn);
      expect(reservation.checkOutDate).toEqual(newCheckOut);
      expect(reservation.numberOfNights).toBe(3);
    });

    it('should throw error when changing dates of cancelled reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      expect(() => reservation.changeDates(createFutureDate(5), createFutureDate(6)))
        .toThrow('Cannot change dates of cancelled reservation');
    });

    it('should throw error when changing dates of confirmed reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm();

      expect(() => reservation.changeDates(createFutureDate(5), createFutureDate(6)))
        .toThrow('Cannot change dates of confirmed reservation');
    });
  });

  describe('active status checks', () => {
    it('isActive should return true for booked reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      expect(reservation.isActive()).toBe(true);
    });

    it('isActive should return true for confirmed reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm();

      expect(reservation.isActive()).toBe(true);
    });

    it('isActive should return false for cancelled reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      expect(reservation.isActive()).toBe(false);
    });

    it('isUpcoming should return true for future active reservation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      expect(reservation.isUpcoming()).toBe(true);
    });
  });

  describe('calculateTotalPrice static method', () => {
    it('should calculate total price for single room and single night', () => {
      const totalPrice = Reservation.calculateTotalPrice(50, 1, 1);

      expect(totalPrice.amount).toBe(50);
      expect(totalPrice.currency).toBe('EUR');
    });

    it('should calculate total price for single room and multiple nights', () => {
      const totalPrice = Reservation.calculateTotalPrice(50, 1, 3);

      expect(totalPrice.amount).toBe(150); // 50 * 1 * 3
    });

    it('should calculate total price for multiple rooms and single night', () => {
      const totalPrice = Reservation.calculateTotalPrice(50, 2, 1);

      expect(totalPrice.amount).toBe(100); // 50 * 2 * 1
    });

    it('should calculate total price for multiple rooms and multiple nights', () => {
      const totalPrice = Reservation.calculateTotalPrice(100, 2, 3);

      expect(totalPrice.amount).toBe(600); // 100 * 2 * 3
    });

    it('should calculate total price in custom currency', () => {
      const totalPrice = Reservation.calculateTotalPrice(50, 1, 2, 'USD');

      expect(totalPrice.amount).toBe(100);
      expect(totalPrice.currency).toBe('USD');
    });
  });

  describe('entity identity', () => {
    it('should consider reservations with same ID as equal', () => {
      const reservationId = 'reservation-123';
      const reservation1 = Reservation.create(
        'customer-1',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100,
        'EUR',
        reservationId
      );
      const reservation2 = Reservation.create(
        'customer-2',
        ['room-2'],
        createFutureDate(5),
        createFutureDate(6),
        200,
        'EUR',
        reservationId
      );

      expect(reservation1.equals(reservation2)).toBe(true);
    });

    it('should consider reservations with different IDs as not equal', () => {
      const reservation1 = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );
      const reservation2 = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      expect(reservation1.equals(reservation2)).toBe(false);
    });
  });

  describe('business rules - hotel reservation workflow', () => {
    it('should support complete reservation workflow: book -> confirm', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(4),
        300
      );

      // Initial state: BOOKED
      expect(reservation.status.isBooked()).toBe(true);
      expect(reservation.totalPrice.amount).toBe(300);

      // Confirmation: payment of second half
      reservation.confirm();
      expect(reservation.status.isConfirmed()).toBe(true);
    });

    it('should support cancellation workflow without refund', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      // Client a déjà payé la moitié (50 EUR)
      reservation.cancel();

      // Annulation: pas de remboursement selon règles métier
      expect(reservation.status.isCancelled()).toBe(true);
      expect(reservation.isActive()).toBe(false);
    });

    it('should calculate correct pricing for 3 nights at 50 EUR', () => {
      const pricePerNight = 50;
      const numberOfRooms = 1;
      const numberOfNights = 3;

      const totalPrice = Reservation.calculateTotalPrice(
        pricePerNight,
        numberOfRooms,
        numberOfNights
      );

      expect(totalPrice.amount).toBe(150);
    });

    it('should support multi-room reservations', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1', 'room-2', 'room-3'],
        createFutureDate(1),
        createFutureDate(4),
        450
      );

      expect(reservation.roomIds.ids).toHaveLength(3);
      expect(reservation.numberOfNights).toBe(3);
    });

    it('should prevent modifications after cancellation', () => {
      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.cancel();

      // Cannot change dates
      expect(() => reservation.changeDates(createFutureDate(5), createFutureDate(6)))
        .toThrow();

      // Cannot update price
      const newPrice = TotalPrice.create(150, 'EUR');
      expect(() => reservation.updateTotalPrice(newPrice)).toThrow();
    });
  });
});
