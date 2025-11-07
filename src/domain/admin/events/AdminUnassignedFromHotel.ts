export class AdminUnassignedFromHotel {
  constructor(
    public readonly adminId: string,
    public readonly hotelId: string,
    public readonly unassignedBy?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
