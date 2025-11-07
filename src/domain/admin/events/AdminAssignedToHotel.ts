export class AdminAssignedToHotel {
  constructor(
    public readonly adminId: string,
    public readonly hotelId: string,
    public readonly assignedBy?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
