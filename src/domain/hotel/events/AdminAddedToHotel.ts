export class AdminAddedToHotel {
  constructor(
    public readonly hotelId: string,
    public readonly adminId: string,
    public readonly addedBy?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
