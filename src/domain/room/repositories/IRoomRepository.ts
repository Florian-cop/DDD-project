import { IRepository } from '../../../core/IRepository';
import { Room } from '../entities/Room';
import { RoomNumber } from '../value-objects/RoomNumber';
import { RoomTypeEnum } from '../value-objects/RoomType';

export interface IRoomRepository extends IRepository<Room> {
  findByRoomNumber(roomNumber: RoomNumber): Promise<Room | null>;
  findAvailableRooms(): Promise<Room[]>;
  findByType(type: RoomTypeEnum): Promise<Room[]>;
  findAvailableByType(type: RoomTypeEnum): Promise<Room[]>;
}
