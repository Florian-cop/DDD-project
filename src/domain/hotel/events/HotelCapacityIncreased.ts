export class HotelCapacityIncreased {
  constructor(
    public readonly hotelId: string,
    public readonly oldCapacity: number,
    public readonly newCapacity: number,
    public readonly currentRoomCount: number,
    public readonly occurredOn: Date = new Date()
  ) {}
}
