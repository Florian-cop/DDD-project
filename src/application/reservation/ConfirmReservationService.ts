import { IReservationRepository, Reservation } from '@domain/reservation';
import { IWalletRepository } from '@domain/wallet';
import { IRoomRepository, Room } from '@domain/room';
import { ConfirmReservationCommand } from './ConfirmReservationCommand';
import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';
import { RoomRepository } from '@infrastructure/db/repositories/RoomRepository';

export class ConfirmReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly prisma: PrismaClient
  ) {}

  async execute(command: ConfirmReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    const wallet = await this.walletRepository.findByCustomerId(reservation.customerId);

    if (!wallet) {
      throw new Error(`Wallet not found for customer "${reservation.customerId}"`);
    }

    if (!reservation.status.isBooked()) {
      throw new Error('Can only confirm payment for booked reservations');
    }

    wallet.deductConfirmationPayment(reservation.totalPrice.amount);

    const rooms: Room[] = [];
    for (const roomId of reservation.roomIds.value) {
      const room = await this.roomRepository.findOneById(roomId);
      if (!room) {
        throw new Error(`Room with id "${roomId}" not found`);
      }
      if (!room.isAvailable) {
        throw new Error(`Room "${roomId}" is not available`);
      }
      room.makeUnavailable();
      rooms.push(room);
    }

    reservation.confirm();

    await this.prisma.$transaction(async (tx) => {
      const txReservationRepo = new ReservationRepository(tx as PrismaClient);
      const txWalletRepo = new WalletRepository(tx as PrismaClient);
      const txRoomRepo = new RoomRepository(tx as PrismaClient);
      
      await txReservationRepo.save(reservation);
      await txWalletRepo.save(wallet);
      
      for (const room of rooms) {
        await txRoomRepo.save(room);
      }
    });

    return reservation;
  }
}
