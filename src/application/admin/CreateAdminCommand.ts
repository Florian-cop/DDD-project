import { AdminRole } from '../domain/admin/index';

export class CreateAdminCommand {
  constructor(
    public readonly customerId: string,
    public readonly role: AdminRole,
    public readonly hotelId?: string
  ) {}
}
