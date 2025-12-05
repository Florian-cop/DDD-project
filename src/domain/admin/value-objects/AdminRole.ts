import { ValueObject } from '@core/ValueObject';

export enum AdminRole {
  ADMIN = 'ADMIN'
}

interface IAdminRoleProps {
  role: AdminRole;
}

export class AdminRoleVO extends ValueObject<IAdminRoleProps> {
  private constructor(props: IAdminRoleProps) {
    super(props);
  }

  get role(): AdminRole {
    return this.props.role;
  }

  get label(): string {
    return 'Administrateur';
  }

  public static create(role: AdminRole = AdminRole.ADMIN): AdminRoleVO {
    if (!Object.values(AdminRole).includes(role)) {
      throw new Error(`Invalid admin role: ${role}`);
    }
    return new AdminRoleVO({ role });
  }
}
