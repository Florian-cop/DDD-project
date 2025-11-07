import { AdminRole } from '../value-objects/AdminRole';

export class AdminRoleChanged {
  constructor(
    public readonly adminId: string,
    public readonly oldRole: AdminRole,
    public readonly newRole: AdminRole,
    public readonly changedBy?: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
