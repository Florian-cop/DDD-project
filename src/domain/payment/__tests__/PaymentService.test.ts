import { PaymentService } from '../PaymentService';
import { Wallet } from '../../wallet/entities/Wallet';
import { Reservation } from '../../reservation/entities/Reservation';
import { Money } from '../../wallet/value-objects/Money';
import { Currency } from '../../wallet/value-objects/Currency';

describe('PaymentService - Domain Service', () => {
  const createFutureDate = (daysFromNow: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(12, 0, 0, 0);
    return date;
  };

  describe('processInitialReservationPayment', () => {
    it('should deduct 50% of reservation total from wallet', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100 // Total: 100 EUR
      );

      const paymentService = new PaymentService();
      paymentService.processInitialReservationPayment(wallet, reservation);

      // Should deduct 50 EUR (half of 100 EUR)
      expect(wallet.balanceInEuros).toBe(150);
    });

    it('should throw error when wallet has insufficient funds', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(30, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100 // Needs 50 EUR, but only has 30 EUR
      );

      const paymentService = new PaymentService();

      expect(() => paymentService.processInitialReservationPayment(wallet, reservation))
        .toThrow('Insufficient funds');
    });

    it('should work with exact amount needed', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(50, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100 // Needs exactly 50 EUR
      );

      const paymentService = new PaymentService();
      paymentService.processInitialReservationPayment(wallet, reservation);

      expect(wallet.balanceInEuros).toBe(0);
    });

    it('should handle decimal amounts correctly', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        99.99 // Half = 49.995
      );

      const paymentService = new PaymentService();
      paymentService.processInitialReservationPayment(wallet, reservation);

      expect(wallet.balanceInEuros).toBeCloseTo(50.005, 2);
    });
  });

  describe('processReservationConfirmationPayment', () => {
    it('should deduct remaining 50% from wallet', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Initial payment
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(150);

      // Confirmation payment
      paymentService.processReservationConfirmationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(100);
    });

    it('should throw error when reservation is not BOOKED', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      reservation.confirm(); // Already confirmed

      const paymentService = new PaymentService();

      expect(() => paymentService.processReservationConfirmationPayment(wallet, reservation))
        .toThrow('Can only confirm payment for booked reservations');
    });

    it('should throw error when wallet has insufficient funds for confirmation', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(70, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Initial payment: 50 EUR (balance becomes 20 EUR)
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(20);

      // Confirmation needs 50 EUR but only has 20 EUR
      expect(() => paymentService.processReservationConfirmationPayment(wallet, reservation))
        .toThrow('Insufficient funds for confirmation');
    });

    it('should work with exact amount needed for confirmation', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Initial: 50 EUR (balance: 50 EUR)
      paymentService.processInitialReservationPayment(wallet, reservation);
      
      // Confirmation: 50 EUR (balance: 0 EUR)
      paymentService.processReservationConfirmationPayment(wallet, reservation);

      expect(wallet.balanceInEuros).toBe(0);
    });
  });

  describe('validateSufficientFundsForReservation', () => {
    it('should not throw when wallet has sufficient funds', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const paymentService = new PaymentService();

      expect(() => paymentService.validateSufficientFundsForReservation(wallet, 100))
        .not.toThrow();
    });

    it('should throw error when wallet has insufficient funds', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(30, Currency.EUR));

      const paymentService = new PaymentService();

      expect(() => paymentService.validateSufficientFundsForReservation(wallet, 100))
        .toThrow('Insufficient funds');
    });

    it('should validate based on 50% of total price', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(50, Currency.EUR));

      const paymentService = new PaymentService();

      // Total is 100 EUR, needs 50 EUR (50%)
      expect(() => paymentService.validateSufficientFundsForReservation(wallet, 100))
        .not.toThrow();
    });

    it('should throw when funds are just below required', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(49.99, Currency.EUR));

      const paymentService = new PaymentService();

      expect(() => paymentService.validateSufficientFundsForReservation(wallet, 100))
        .toThrow('Insufficient funds');
    });
  });

  describe('business rules - complete hotel payment workflow', () => {
    it('should support full reservation payment workflow', () => {
      // Setup
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(500, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1', 'room-2'],
        createFutureDate(1),
        createFutureDate(4),
        600 // 2 rooms * 100 EUR * 3 nights
      );

      const paymentService = new PaymentService();

      // Step 1: Validate before reservation
      expect(() => paymentService.validateSufficientFundsForReservation(wallet, 600))
        .not.toThrow();

      // Step 2: Initial payment (50% = 300 EUR)
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(200); // 500 - 300

      // Step 3: Confirmation payment (50% = 300 EUR)
      // Client needs to add more funds first
      wallet.addFunds(Money.create(200, Currency.EUR)); // Add 200 more
      expect(wallet.balanceInEuros).toBe(400);

      paymentService.processReservationConfirmationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(100); // 400 - 300
    });

    it('should enforce no refund policy on cancellation', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Initial payment: 50 EUR
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(150);

      // Cancellation - no refund according to business rules
      reservation.cancel();
      
      // Balance remains at 150 EUR (no refund)
      expect(wallet.balanceInEuros).toBe(150);
      expect(reservation.status.isCancelled()).toBe(true);
    });

    it('should handle multi-currency wallet with EUR reservations', () => {
      const wallet = Wallet.create('customer-123');
      
      // Add funds in different currencies
      wallet.addFunds(Money.create(100, Currency.USD)); // 92 EUR
      wallet.addFunds(Money.create(50, Currency.GBP));  // 58.5 EUR
      
      // Total: 92 + 58.5 = 150.5 EUR

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Should work because 150.5 EUR > 50 EUR needed
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBeCloseTo(100.5, 1);
    });

    it('should calculate deposit correctly for different room types', () => {
      const paymentService = new PaymentService();

      // Standard room: 50 EUR * 3 nights = 150 EUR
      const standardReservation = Reservation.create(
        'customer-123',
        ['standard-room'],
        createFutureDate(1),
        createFutureDate(4),
        150
      );

      const standardWallet = Wallet.create('customer-123');
      standardWallet.addFunds(Money.create(100, Currency.EUR));
      
      paymentService.processInitialReservationPayment(standardWallet, standardReservation);
      expect(standardWallet.balanceInEuros).toBe(25); // 100 - 75 (half of 150)

      // Suite: 200 EUR * 3 nights = 600 EUR
      const suiteReservation = Reservation.create(
        'customer-456',
        ['suite-room'],
        createFutureDate(1),
        createFutureDate(4),
        600
      );

      const suiteWallet = Wallet.create('customer-456');
      suiteWallet.addFunds(Money.create(500, Currency.EUR));
      
      paymentService.processInitialReservationPayment(suiteWallet, suiteReservation);
      expect(suiteWallet.balanceInEuros).toBe(200); // 500 - 300 (half of 600)
    });
  });

  describe('domain service behavior', () => {
    it('should coordinate between wallet and reservation aggregates', () => {
      // PaymentService is a domain service that coordinates
      // payment logic between Wallet and Reservation aggregates
      
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Domain service handles the complex business rule:
      // "50% at booking, 50% at confirmation"
      const initialBalance = wallet.balanceInEuros;
      paymentService.processInitialReservationPayment(wallet, reservation);
      const afterInitial = wallet.balanceInEuros;

      expect(afterInitial).toBe(initialBalance - 50);
    });

    it('should maintain consistency between payment and reservation state', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const reservation = Reservation.create(
        'customer-123',
        ['room-1'],
        createFutureDate(1),
        createFutureDate(2),
        100
      );

      const paymentService = new PaymentService();

      // Initial payment
      expect(reservation.status.isBooked()).toBe(true);
      paymentService.processInitialReservationPayment(wallet, reservation);
      expect(wallet.balanceInEuros).toBe(50);

      // Confirmation payment - should only work on BOOKED status
      expect(() => paymentService.processReservationConfirmationPayment(wallet, reservation))
        .not.toThrow();
      
      // After confirmation, cannot process confirmation payment again
      reservation.confirm();
      expect(() => paymentService.processReservationConfirmationPayment(wallet, reservation))
        .toThrow();
    });
  });
});
