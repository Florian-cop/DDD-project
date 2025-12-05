import { IHotelRepository, Hotel } from '@domain/hotel';
import { GetHotelQuery } from './GetHotelQuery';

export class GetHotelService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(query: GetHotelQuery): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOneById(query.id);

    if (!hotel) {
      throw new Error(`Hotel with id "${query.id}" not found`);
    }

    return hotel;
  }
}
