export class UpdateWalletCommand {
  constructor(
    public readonly customerId: string,
    public readonly newBalance: number
  ) {}
}
