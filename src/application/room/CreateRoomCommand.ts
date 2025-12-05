import { RoomTypeEnum } from '../domain/room/index';

export class CreateRoomCommand {
  constructor(
    public readonly roomNumber: string,
    public readonly type: RoomTypeEnum,
    public readonly isAvailable: boolean = true
  ) {}
}
