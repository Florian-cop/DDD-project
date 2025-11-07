import { RoomAccessory } from '../../../domain/room';

export class UpdateRoomCommand {
  constructor(
    public readonly id: string,
    public readonly isAvailable?: boolean,
    public readonly accessoriesToAdd?: RoomAccessory[],
    public readonly accessoriesToRemove?: RoomAccessory[]
  ) {}
}
