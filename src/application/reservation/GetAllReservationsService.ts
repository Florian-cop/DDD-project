import { IReservationRepository, Reservation } from '../../../domain/reservation';

export class GetAllReservationsService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(): Promise<Reservation[]> {
    return await this.reservationRepository.findAll();
  }
}
