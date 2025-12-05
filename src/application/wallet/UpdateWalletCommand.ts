export class UpdateWalletCommand {
  constructor(
    public readonly customerId: string,
    public readonly amount: number,
    public readonly currency: string = 'EUR'
  ) {}
}
