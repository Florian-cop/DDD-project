import { IRoomRepository } from '@domain/room/repositories/IRoomRepository';
import { IReservationRepository } from '@domain/reservation/repositories/IReservationRepository';
import { ReleaseRoomCommand } from './ReleaseRoomCommand';
import { Room } from '@domain/room/entities/Room';

export class ReleaseRoomService {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly reservationRepository: IReservationRepository
  ) {}

  async execute(command: ReleaseRoomCommand): Promise<Room> {
    const room = await this.roomRepository.findOneById(command.roomId);

    if (!room) {
      throw new Error(`Room with id "${command.roomId}" not found`);
    }

    if (room.isAvailable) {
      throw new Error(`Room "${command.roomId}" is already available`);
    }

    if (command.reservationId) {
      const reservation = await this.reservationRepository.findOneById(command.reservationId);

      if (!reservation) {
        throw new Error(`Reservation with id "${command.reservationId}" not found`);
      }

      if (reservation.customerId !== command.customerId) {
        throw new Error('Customer is not the owner of this reservation');
      }

      if (!reservation.roomIds.hasRoom(command.roomId)) {
        throw new Error('Room is not part of this reservation');
      }

      if (reservation.status.isCancelled()) {
        throw new Error('Cannot release room from cancelled reservation');
      }
    }

    room.makeAvailable();

    await this.roomRepository.save(room);

    return room;
  }
}
