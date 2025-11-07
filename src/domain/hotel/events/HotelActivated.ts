export class HotelActivated {
  constructor(
    public readonly hotelId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
