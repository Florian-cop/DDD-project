import { IRepository } from '../../../core/IRepository';
import { Hotel } from '../entities/Hotel';

export interface IHotelRepository extends IRepository<Hotel> {
  findByName(name: string): Promise<Hotel | null>;
  findByAdminId(adminId: string): Promise<Hotel[]>;
  findActiveHotels(): Promise<Hotel[]>;
  findByCity(city: string): Promise<Hotel[]>;
  findByStarRating(rating: number): Promise<Hotel[]>;
  findHotelsWithAvailableCapacity(): Promise<Hotel[]>;
}
