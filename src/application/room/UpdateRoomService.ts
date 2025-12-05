import { IRoomRepository, Room } from '../domain/room/index';
import { UpdateRoomCommand } from './UpdateRoomCommand';

export class UpdateRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(command: UpdateRoomCommand): Promise<Room> {
    const room = await this.roomRepository.findOneById(command.id);

    if (!room) {
      throw new Error(`Room with id "${command.id}" not found`);
    }

    if (command.isAvailable !== undefined) {
      if (command.isAvailable) {
        room.makeAvailable();
      } else {
        room.makeUnavailable();
      }
    }

    if (command.accessoriesToAdd) {
      command.accessoriesToAdd.forEach(accessory => {
        room.addAccessory(accessory);
      });
    }

    if (command.accessoriesToRemove) {
      command.accessoriesToRemove.forEach(accessory => {
        room.removeAccessory(accessory);
      });
    }

    await this.roomRepository.save(room);

    return room;
  }
}
