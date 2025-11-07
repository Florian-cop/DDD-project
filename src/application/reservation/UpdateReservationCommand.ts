export class UpdateReservationCommand {
  constructor(
    public readonly id: string,
    public readonly newCheckInDate?: Date,
    public readonly newCheckOutDate?: Date,
    public readonly roomIdsToAdd?: string[],
    public readonly roomIdsToRemove?: string[]
  ) {}
}
