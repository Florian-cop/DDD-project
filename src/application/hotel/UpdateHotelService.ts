import { IHotelRepository, Hotel, HotelName, StarRating } from '../../../domain/hotel';
import { UpdateHotelCommand } from './UpdateHotelCommand';

export class UpdateHotelService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(command: UpdateHotelCommand): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOneById(command.id);

    if (!hotel) {
      throw new Error(`Hotel with id "${command.id}" not found`);
    }

    if (command.name) {
      const nameVO = HotelName.create(command.name);
      hotel.updateName(nameVO);
    }

    if (command.description !== undefined) {
      hotel.updateDescription(command.description);
    }

    if (command.starRating) {
      const ratingVO = StarRating.create(command.starRating);
      hotel.updateStarRating(ratingVO);
    }

    if (command.roomIdsToAdd) {
      command.roomIdsToAdd.forEach(roomId => {
        hotel.addRoom(roomId);
      });
    }

    if (command.roomIdsToRemove) {
      command.roomIdsToRemove.forEach(roomId => {
        hotel.removeRoom(roomId);
      });
    }

    if (command.adminIdsToAdd) {
      command.adminIdsToAdd.forEach(adminId => {
        hotel.addAdmin(adminId);
      });
    }

    if (command.adminIdsToRemove) {
      command.adminIdsToRemove.forEach(adminId => {
        hotel.removeAdmin(adminId);
      });
    }

    await this.hotelRepository.save(hotel);

    return hotel;
  }
}
