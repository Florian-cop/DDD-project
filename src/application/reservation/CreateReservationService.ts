import { IReservationRepository, Reservation } from '../../../domain/reservation';
import { CreateReservationCommand } from './CreateReservationCommand';

export class CreateReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    // Vérifier les conflits de réservation pour chaque chambre
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

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
