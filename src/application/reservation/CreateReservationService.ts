import { IReservationRepository, Reservation } from '../domain/reservation/index';
import { IWalletRepository } from '../../../domain/wallet/repositories/IWalletRepository';
import { PaymentService } from '../../../domain/payment/PaymentService';
import { CreateReservationCommand } from './CreateReservationCommand';

export class CreateReservationService {
  private readonly paymentService: PaymentService;

  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository
  ) {
    this.paymentService = new PaymentService();
  }

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    const wallet = await this.walletRepository.findByCustomerId(command.customerId);
    
    if (!wallet) {
      throw new Error(`Wallet not found for customer "${command.customerId}"`);
    }

    for (const roomId of command.roomIds) {
      const conflicts = await this.reservationRepository.findConflictingReservations(
        roomId,
        command.checkInDate,
        command.checkOutDate
      );

      if (conflicts.length > 0) {
        throw new Error(`Room "${roomId}" is already booked for the selected dates`);
      }
    }

    const reservation = Reservation.create(
      command.customerId,
      command.roomIds,
      command.checkInDate,
      command.checkOutDate,
      command.totalPrice,
      command.currency
    );

    this.paymentService.processInitialReservationPayment(wallet, reservation);

    await this.reservationRepository.save(reservation);
    await this.walletRepository.save(wallet);

    return reservation;
  }
}
