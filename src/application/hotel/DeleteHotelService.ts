import { IHotelRepository } from '@domain/hotel';
import { DeleteHotelCommand } from './DeleteHotelCommand';

export class DeleteHotelService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(command: DeleteHotelCommand): Promise<void> {
    const exists = await this.hotelRepository.doesExists(command.id);

    if (!exists) {
      throw new Error(`Hotel with id "${command.id}" not found`);
    }

    await this.hotelRepository.delete(command.id);
  }
}
