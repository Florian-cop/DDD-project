export class HotelDeactivated {
  constructor(
    public readonly hotelId: string,
    public readonly reason?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
