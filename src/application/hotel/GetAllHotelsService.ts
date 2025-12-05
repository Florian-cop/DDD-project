import { IHotelRepository, Hotel } from '../domain/hotel/index';

export class GetAllHotelsService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(): Promise<Hotel[]> {
    return await this.hotelRepository.findAll();
  }
}
