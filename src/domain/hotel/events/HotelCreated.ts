export class HotelCreated {
  constructor(
    public readonly hotelId: string,
    public readonly name: string,
    public readonly address: string,
    public readonly maxRoomsCapacity: number,
    public readonly starRating: number,
    public readonly adminId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
