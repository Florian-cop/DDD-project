import { IRoomRepository, Room } from '../domain/room/index';

export class GetAllRoomsService {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(): Promise<Room[]> {
    return await this.roomRepository.findAll();
  }
}
