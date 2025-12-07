import { IReservationRepository, Reservation } from '@domain/reservation';
import { IWalletRepository } from '@domain/wallet';
import { PaymentService } from '@domain/payment';
import { CreateReservationCommand } from './CreateReservationCommand';
import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';

export class CreateReservationService {
  private readonly paymentService: PaymentService;

  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly prisma: PrismaClient
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

    await this.prisma.$transaction(async (tx) => {
      const txReservationRepo = new ReservationRepository(tx as PrismaClient);
      const txWalletRepo = new WalletRepository(tx as PrismaClient);
      
      await txReservationRepo.save(reservation);
      await txWalletRepo.save(wallet);
    });

    return reservation;
  }
}
