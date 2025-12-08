export class GetAdminQuery {
  constructor(public readonly adminId: string) {
    if (!adminId || adminId.trim().length === 0) {
      throw new Error('Admin ID is required');
    }
  }
}
