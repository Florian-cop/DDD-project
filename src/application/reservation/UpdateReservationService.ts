import { IReservationRepository, Reservation } from '@domain/reservation';
import { UpdateReservationCommand } from './UpdateReservationCommand';

export class UpdateReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: UpdateReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    if (command.newCheckInDate && command.newCheckOutDate) {
      reservation.changeDates(command.newCheckInDate, command.newCheckOutDate);
    }

    if (command.roomIdsToAdd) {
      command.roomIdsToAdd.forEach(roomId => {
        reservation.addRoom(roomId);
      });
    }

    if (command.roomIdsToRemove) {
      command.roomIdsToRemove.forEach(roomId => {
        reservation.removeRoom(roomId);
      });
    }

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
