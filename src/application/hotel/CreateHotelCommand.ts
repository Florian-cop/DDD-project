export class CreateHotelCommand {
  constructor(
    public readonly name: string,
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly country: string,
    public readonly maxRoomsCapacity: number,
    public readonly starRating: number,
    public readonly adminId: string,
    public readonly description?: string
  ) {}
}
