import { IReservationRepository, Reservation } from '@domain/reservation';
import { IWalletRepository } from '@domain/wallet';
import { IRoomRepository } from '@domain/room';
import { CreateReservationCommand } from './CreateReservationCommand';
import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';

export class CreateReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly prisma: PrismaClient
  ) {}

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    const wallet = await this.walletRepository.findByCustomerId(command.customerId);
    
    if (!wallet) {
      throw new Error(`Wallet not found for customer "${command.customerId}"`);
    }

    const rooms = [];
    for (const roomId of command.roomIds) {
      const room = await this.roomRepository.findOneById(roomId);
      
      if (!room) {
        throw new Error(`Room "${roomId}" not found`);
      }

      rooms.push(room);

      const conflicts = await this.reservationRepository.findConflictingReservations(
        roomId,
        command.checkInDate,
        command.checkOutDate
      );

      if (conflicts.length > 0) {
        throw new Error(`Room "${roomId}" is already booked for the selected dates`);
      }
    }

    const numberOfNights = Math.ceil(
      (command.checkOutDate.getTime() - command.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPricePerNight = rooms.reduce((sum, room) => sum + room.pricePerNight, 0);
    const totalPrice = totalPricePerNight * numberOfNights;

    const reservation = Reservation.create(
      command.customerId,
      command.roomIds,
      command.checkInDate,
      command.checkOutDate,
      totalPrice,
      command.currency
    );

    wallet.deductInitialReservationPayment(reservation.totalPrice.amount);

    await this.prisma.$transaction(async (tx) => {
      const txReservationRepo = new ReservationRepository(tx as PrismaClient);
      const txWalletRepo = new WalletRepository(tx as PrismaClient);
      
      await txReservationRepo.save(reservation);
      await txWalletRepo.save(wallet);
    });

    return reservation;
  }
}
