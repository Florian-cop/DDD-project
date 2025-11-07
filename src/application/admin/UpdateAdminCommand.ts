import { AdminRole } from '../../../domain/admin';

export class UpdateAdminCommand {
  constructor(
    public readonly id: string,
    public readonly role?: AdminRole,
    public readonly hotelIdsToAssign?: string[],
    public readonly hotelIdsToUnassign?: string[],
    public readonly activate?: boolean
  ) {}
}
