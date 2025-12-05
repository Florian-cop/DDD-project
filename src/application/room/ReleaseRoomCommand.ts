export class ReleaseRoomCommand {
  constructor(
    public readonly roomId: string,
    public readonly customerId: string,
    public readonly reservationId?: string
  ) {}
}
