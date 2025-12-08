import { IReservationRepository, Reservation } from '@domain/reservation';
import { IRoomRepository, Room } from '@domain/room';
import { CancelReservationCommand } from './CancelReservationCommand';
import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { RoomRepository } from '@infrastructure/db/repositories/RoomRepository';

export class CancelReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly prisma: PrismaClient
  ) {}

  async execute(command: CancelReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    const wasConfirmed = reservation.status.isConfirmed();

    const rooms: Room[] = [];
    if (wasConfirmed) {
      for (const roomId of reservation.roomIds.value) {
        const room = await this.roomRepository.findOneById(roomId);
        if (!room) {
          throw new Error(`Room with id "${roomId}" not found`);
        }
        room.makeAvailable();
        rooms.push(room);
      }
    }

    reservation.cancel();

    await this.prisma.$transaction(async (tx) => {
      const txReservationRepo = new ReservationRepository(tx as PrismaClient);
      const txRoomRepo = new RoomRepository(tx as PrismaClient);

      await txReservationRepo.save(reservation);

      for (const room of rooms) {
        await txRoomRepo.save(room);
      }
    });

    return reservation;
  }
}
