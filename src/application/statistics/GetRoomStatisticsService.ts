import { IRoomRepository } from '@domain/room/repositories/IRoomRepository';
import { GetRoomStatisticsQuery } from './GetRoomStatisticsQuery';

export interface RoomStatistics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  byType: {
    type: string;
    total: number;
    available: number;
    occupied: number;
  }[];
}

export class GetRoomStatisticsService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(query: GetRoomStatisticsQuery): Promise<RoomStatistics> {
    const allRooms = await this.roomRepository.findAll();
    
    const totalRooms = allRooms.length;
    const availableRooms = allRooms.filter(room => room.isAvailable).length;
    const occupiedRooms = totalRooms - availableRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    const byType = ['STANDARD', 'DELUXE', 'SUITE'].map(type => {
      const roomsOfType = allRooms.filter(room => room.typeName === type);
      const availableOfType = roomsOfType.filter(room => room.isAvailable).length;
      
      return {
        type,
        total: roomsOfType.length,
        available: availableOfType,
        occupied: roomsOfType.length - availableOfType
      };
    });

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      byType
    };
  }
}
