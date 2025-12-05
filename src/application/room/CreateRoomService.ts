import { IRoomRepository, Room, RoomNumber } from '@domain/room';
import { CreateRoomCommand } from './CreateRoomCommand';

export class CreateRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(command: CreateRoomCommand): Promise<Room> {
    const roomNumberVO = RoomNumber.create(command.roomNumber);
    
    const existingRoom = await this.roomRepository.findByRoomNumber(roomNumberVO);
    
    if (existingRoom) {
      throw new Error(`Room with number "${command.roomNumber}" already exists`);
    }

    const room = Room.create(
      command.roomNumber,
      command.type,
      undefined, // accessoires par défaut
      command.isAvailable
    );

    await this.roomRepository.save(room);

    return room;
  }
}
