export class AdminRemovedFromHotel {
  constructor(
    public readonly hotelId: string,
    public readonly adminId: string,
    public readonly removedBy?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
