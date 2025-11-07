import { IRoomRepository } from '../../../domain/room';
import { DeleteRoomCommand } from './DeleteRoomCommand';

export class DeleteRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(command: DeleteRoomCommand): Promise<void> {
    const exists = await this.roomRepository.doesExists(command.id);

    if (!exists) {
      throw new Error(`Room with id "${command.id}" not found`);
    }

    await this.roomRepository.delete(command.id);
  }
}
