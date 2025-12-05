import { PrismaClient } from '@prisma/client';
import { IRoomRepository } from '@domain/room/repositories/IRoomRepository';
import { Room } from '@domain/room/entities/Room';
import { RoomNumber } from '@domain/room/value-objects/RoomNumber';
import { RoomTypeEnum } from '@domain/room/value-objects/RoomType';

type PrismaRoom = {
  id: string;
  number: string;
  type: string;
  isAvailable: boolean;
  hotelId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class RoomRepository implements IRoomRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany();
    
    return rooms.map((room: PrismaRoom) => this.toDomain(room));
  }

  async findOneById(id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      return null;
    }

    return this.toDomain(room);
  }

  async findByRoomNumber(roomNumber: RoomNumber): Promise<Room | null> {
    const room = await this.prisma.room.findFirst({
      where: { number: roomNumber.value }
    });

    if (!room) {
      return null;
    }

    return this.toDomain(room);
  }

  async findAvailableRooms(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany();
    
    return rooms.map((room: PrismaRoom) => this.toDomain(room)).filter((room: Room) => room.isAvailable);
  }

  async findByType(type: RoomTypeEnum): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: { type: type }
    });
    
    return rooms.map((room: PrismaRoom) => this.toDomain(room));
  }

  async findAvailableByType(type: RoomTypeEnum): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: { type: type }
    });
    
    return rooms.map((room: PrismaRoom) => this.toDomain(room)).filter((room: Room) => room.isAvailable);
  }

  async doesExists(id: string): Promise<boolean> {
    const count = await this.prisma.room.count({
      where: { id }
    });

    return count > 0;
  }

  async save(entity: Room): Promise<void> {
    const typeDb = this.mapTypeToDb(entity.type.type);
    
    await this.prisma.room.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        number: entity.roomNumber.value,
        type: typeDb as any,
        isAvailable: entity.isAvailable,
        hotelId: 'default-hotel-id'
      },
      update: {
        number: entity.roomNumber.value,
        type: typeDb as any,
        isAvailable: entity.isAvailable
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.room.delete({
      where: { id }
    });
  }

  private toDomain(prismaRoom: PrismaRoom): Room {
    const roomType = this.mapTypeFromDb(prismaRoom.type);
    
    const room = Room.create(
      prismaRoom.number,
      roomType,
      undefined,
      prismaRoom.isAvailable,
      prismaRoom.id
    );

    return room;
  }

  private mapTypeFromDb(dbType: string): RoomTypeEnum {
    switch (dbType) {
      case 'STANDARD':
        return RoomTypeEnum.STANDARD;
      case 'DELUXE':
        return RoomTypeEnum.DELUXE;
      case 'SUITE':
        return RoomTypeEnum.SUITE;
      default:
        return RoomTypeEnum.STANDARD;
    }
  }

  private mapTypeToDb(type: RoomTypeEnum): string {
    switch (type) {
      case RoomTypeEnum.STANDARD:
        return 'STANDARD';
      case RoomTypeEnum.DELUXE:
        return 'DELUXE';
      case RoomTypeEnum.SUITE:
        return 'SUITE';
      default:
        return 'STANDARD';
    }
  }
}
