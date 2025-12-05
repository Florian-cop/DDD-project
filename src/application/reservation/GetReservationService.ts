import { IReservationRepository, Reservation } from '../domain/reservation/index';
import { GetReservationQuery } from './GetReservationQuery';

export class GetReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(query: GetReservationQuery): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneById(query.id);

    if (!reservation) {
      throw new Error(`Reservation with id "${query.id}" not found`);
    }

    return reservation;
  }
}
