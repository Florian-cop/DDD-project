import { IReservationRepository } from '@domain/reservation';
import { DeleteReservationCommand } from './DeleteReservationCommand';

export class DeleteReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: DeleteReservationCommand): Promise<void> {
    const exists = await this.reservationRepository.doesExists(command.id);

    if (!exists) {
      throw new Error(`Reservation with id "${command.id}" not found`);
    }

    await this.reservationRepository.delete(command.id);
  }
}
