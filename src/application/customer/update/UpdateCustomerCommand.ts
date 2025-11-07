export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly firstname?: string,
    public readonly lastname?: string,
    public readonly phoneNumber?: string
  ) {}
}
