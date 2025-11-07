import { AdminRole } from '../value-objects/AdminRole';

export class AdminCreated {
  constructor(
    public readonly adminId: string,
    public readonly customerId: string,
    public readonly role: AdminRole,
    public readonly hotelId?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
