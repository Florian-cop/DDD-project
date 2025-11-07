import { AdminRole } from '../../../domain/admin';

export class CreateAdminCommand {
  constructor(
    public readonly customerId: string,
    public readonly role: AdminRole,
    public readonly hotelId?: string
  ) {}
}
