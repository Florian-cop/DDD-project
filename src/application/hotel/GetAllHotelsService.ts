import { IHotelRepository, Hotel } from '../../../domain/hotel';

export class GetAllHotelsService {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(): Promise<Hotel[]> {
    return await this.hotelRepository.findAll();
  }
}
