import { IReservationRepository, Reservation } from '../../../domain/reservation';
import { ConfirmReservationCommand } from './ConfirmReservationCommand';

export class ConfirmReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: ConfirmReservationCommand): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(command.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    reservation.confirm();

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
