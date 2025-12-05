import { IReservationRepository, Reservation } from '../domain/reservation/index';
import { CancelReservationCommand } from './CancelReservationCommand';

export class CancelReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: CancelReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    reservation.cancel();

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
