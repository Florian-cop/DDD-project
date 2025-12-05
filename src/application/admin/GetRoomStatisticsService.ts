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
  constructor(
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(query: GetRoomStatisticsQuery): Promise<RoomStatistics> {
    const allRooms = await this.roomRepository.findAll();
    
    if (allRooms.length === 0) {
      return {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        occupancyRate: 0,
        byType: []
      };
    }

    const availableRooms = allRooms.filter(room => room.isAvailable);
    const occupiedRooms = allRooms.filter(room => !room.isAvailable);

    const byTypeMap = new Map<string, { total: number; available: number; occupied: number }>();

    for (const room of allRooms) {
      const typeName = room.typeName;
      
      if (!byTypeMap.has(typeName)) {
        byTypeMap.set(typeName, { total: 0, available: 0, occupied: 0 });
      }

      const stats = byTypeMap.get(typeName)!;
      stats.total++;
      
      if (room.isAvailable) {
        stats.available++;
      } else {
        stats.occupied++;
      }
    }

    const byType = Array.from(byTypeMap.entries()).map(([type, stats]) => ({
      type,
      total: stats.total,
      available: stats.available,
      occupied: stats.occupied
    }));

    const occupancyRate = allRooms.length > 0 
      ? (occupiedRooms.length / allRooms.length) * 100 
      : 0;

    return {
      totalRooms: allRooms.length,
      availableRooms: availableRooms.length,
      occupiedRooms: occupiedRooms.length,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      byType
    };
  }
}
