export class CreateReservationCommand {
  constructor(
    public readonly customerId: string,
    public readonly roomIds: string[],
    public readonly checkInDate: Date,
    public readonly checkOutDate: Date,
    public readonly currency: string = 'EUR'
  ) {}
}
