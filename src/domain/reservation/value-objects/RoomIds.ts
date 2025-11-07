import { ValueObject } from '../../../core/ValueObject';

interface IRoomIdsProps {
  roomIds: string[];
}

export class RoomIds extends ValueObject<IRoomIdsProps> {
  private constructor(props: IRoomIdsProps) {
    super(props);
  }

  get value(): string[] {
    return [...this.props.roomIds];
  }

  get count(): number {
    return this.props.roomIds.length;
  }

  public static create(roomIds: string[]): RoomIds {
    if (!roomIds || roomIds.length === 0) {
      throw new Error('Reservation must have at least one room');
    }

    // Enlever les doublons
    const uniqueRoomIds = Array.from(new Set(roomIds));

    // Validation : vérifier que tous les IDs sont valides (non vides)
    if (uniqueRoomIds.some(id => !id || id.trim().length === 0)) {
      throw new Error('All room IDs must be valid');
    }

    return new RoomIds({ roomIds: uniqueRoomIds });
  }

  public includes(roomId: string): boolean {
    return this.props.roomIds.includes(roomId);
  }

  public addRoom(roomId: string): RoomIds {
    if (this.includes(roomId)) {
      return this; // Déjà présent
    }

    if (!roomId || roomId.trim().length === 0) {
      throw new Error('Room ID must be valid');
    }

    return new RoomIds({ roomIds: [...this.props.roomIds, roomId] });
  }

  public removeRoom(roomId: string): RoomIds {
    const newRoomIds = this.props.roomIds.filter(id => id !== roomId);
    
    if (newRoomIds.length === 0) {
      throw new Error('Reservation must have at least one room');
    }

    return new RoomIds({ roomIds: newRoomIds });
  }
}
