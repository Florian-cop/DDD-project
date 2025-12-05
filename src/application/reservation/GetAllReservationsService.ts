import { IReservationRepository, Reservation } from '../domain/reservation/index';

export class GetAllReservationsService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(): Promise<Reservation[]> {
    return await this.reservationRepository.findAll();
  }
}
