import { RoomTypeEnum } from '@domain/room';

export class CreateRoomCommand {
  constructor(
    public readonly roomNumber: string,
    public readonly type: RoomTypeEnum,
    public readonly isAvailable: boolean = true
  ) {}
}
