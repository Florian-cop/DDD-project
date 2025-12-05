import { Wallet } from '../wallet/entities/Wallet';
import { Reservation } from '../reservation/entities/Reservation';
import { Money } from '../wallet/value-objects/Money';
import { Currency } from '../wallet/value-objects/Currency';

export class PaymentService {
  public processInitialReservationPayment(
    wallet: Wallet,
    reservation: Reservation
  ): void {
    const totalPrice = reservation.totalPrice;
    const halfAmount = totalPrice.amount / 2;
    const paymentAmount = Money.create(halfAmount, Currency.EUR);

    if (!wallet.hasSufficientFunds(paymentAmount)) {
      throw new Error(
        `Insufficient funds. Required: ${paymentAmount.format()}, Available: ${wallet.balanceInEuros.toFixed(2)} EUR`
      );
    }

    wallet.deduct(paymentAmount);
  }

  public processReservationConfirmationPayment(
    wallet: Wallet,
    reservation: Reservation
  ): void {
    if (!reservation.status.isBooked()) {
      throw new Error('Can only confirm payment for booked reservations');
    }

    const totalPrice = reservation.totalPrice;
    const halfAmount = totalPrice.amount / 2;
    const paymentAmount = Money.create(halfAmount, Currency.EUR);

    if (!wallet.hasSufficientFunds(paymentAmount)) {
      throw new Error(
        `Insufficient funds for confirmation. Required: ${paymentAmount.format()}, Available: ${wallet.balanceInEuros.toFixed(2)} EUR`
      );
    }

    wallet.deduct(paymentAmount);
  }

  public validateSufficientFundsForReservation(
    wallet: Wallet,
    totalPrice: number
  ): void {
    const halfAmount = totalPrice / 2;
    const requiredAmount = Money.create(halfAmount, Currency.EUR);

    if (!wallet.hasSufficientFunds(requiredAmount)) {
      throw new Error(
        `Insufficient funds. Required: ${requiredAmount.format()}, Available: ${wallet.balanceInEuros.toFixed(2)} EUR`
      );
    }
  }
}
