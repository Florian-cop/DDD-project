import { IReservationRepository, Reservation } from '@domain/reservation';
import { IWalletRepository } from '@domain/wallet';
import { PaymentService } from '@domain/payment';
import { ConfirmReservationCommand } from './ConfirmReservationCommand';

export class ConfirmReservationService {
  private readonly paymentService: PaymentService;

  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository
  ) {
    this.paymentService = new PaymentService();
  }

  async execute(command: ConfirmReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(reservation.customerId);

    if (!wallet) {
      throw new Error(`Wallet not found for customer "${reservation.customerId}"`);
    }

    // Valider le paiement AVANT de confirmer
    this.paymentService.processReservationConfirmationPayment(wallet, reservation);

    reservation.confirm();

    // Transaction: sauvegarder réservation confirmée ET wallet débité de manière atomique
    await this.reservationRepository.save(reservation);
    await this.walletRepository.save(wallet);

    return reservation;
  }
}
