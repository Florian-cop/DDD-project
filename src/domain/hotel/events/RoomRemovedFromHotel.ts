export class RoomRemovedFromHotel {
  constructor(
    public readonly hotelId: string,
    public readonly roomId: string,
    public readonly currentRoomCount: number,
    public readonly occurredOn: Date = new Date()
  ) {}
}
