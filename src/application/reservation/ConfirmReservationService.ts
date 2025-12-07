import { IReservationRepository, Reservation } from '@domain/reservation';
import { IWalletRepository } from '@domain/wallet';
import { PaymentService } from '@domain/payment';
import { ConfirmReservationCommand } from './ConfirmReservationCommand';
import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';

export class ConfirmReservationService {
  private readonly paymentService: PaymentService;

  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly prisma: PrismaClient
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

    this.paymentService.processReservationConfirmationPayment(wallet, reservation);

    reservation.confirm();

    await this.prisma.$transaction(async (tx) => {
      const txReservationRepo = new ReservationRepository(tx as PrismaClient);
      const txWalletRepo = new WalletRepository(tx as PrismaClient);
      
      await txReservationRepo.save(reservation);
      await txWalletRepo.save(wallet);
    });

    return reservation;
  }
}
