export class UpdateHotelCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly starRating?: number,
    public readonly roomIdsToAdd?: string[],
    public readonly roomIdsToRemove?: string[],
    public readonly adminIdsToAdd?: string[],
    public readonly adminIdsToRemove?: string[]
  ) {}
}
