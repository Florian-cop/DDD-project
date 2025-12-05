import { IRoomRepository, Room } from '../domain/room/index';
import { GetRoomQuery } from './GetRoomQuery';

export class GetRoomService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(query: GetRoomQuery): Promise<Room> {
    const room = await this.roomRepository.findOneById(query.id);

    if (!room) {
      throw new Error(`Room with id "${query.id}" not found`);
    }

    return room;
  }
}
