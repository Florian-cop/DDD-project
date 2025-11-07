export class RoomAddedToHotel {
  constructor(
    public readonly hotelId: string,
    public readonly roomId: string,
    public readonly currentRoomCount: number,
    public readonly remainingCapacity: number,
    public readonly occurredOn: Date = new Date()
  ) {}
}
