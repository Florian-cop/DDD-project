import { IHotelRepository, Hotel, HotelName } from '@domain/hotel';
import { CreateHotelCommand } from './CreateHotelCommand';

export class CreateHotelService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(command: CreateHotelCommand): Promise<Hotel> {
    const hotelNameVO = HotelName.create(command.name);
    
    const existingHotel = await this.hotelRepository.findByName(command.name);
    
    if (existingHotel) {
      throw new Error(`Hotel with name "${command.name}" already exists`);
    }

    const hotel = Hotel.create(
      command.name,
      command.street,
      command.city,
      command.postalCode,
      command.country,
      command.maxRoomsCapacity,
      command.starRating,
      command.adminId,
      command.description
    );

    await this.hotelRepository.save(hotel);

    return hotel;
  }
}
