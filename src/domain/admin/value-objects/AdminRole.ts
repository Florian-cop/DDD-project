import { ValueObject } from '../../../core/ValueObject';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',      // Gère tout le système
  HOTEL_MANAGER = 'HOTEL_MANAGER',  // Gère un hôtel spécifique
  RECEPTIONIST = 'RECEPTIONIST'     // Gère les réservations
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
    switch (this.props.role) {
      case AdminRole.SUPER_ADMIN:
        return 'Super Administrator';
      case AdminRole.HOTEL_MANAGER:
        return 'Hotel Manager';
      case AdminRole.RECEPTIONIST:
        return 'Receptionist';
    }
  }

  public isSuperAdmin(): boolean {
    return this.props.role === AdminRole.SUPER_ADMIN;
  }

  public isHotelManager(): boolean {
    return this.props.role === AdminRole.HOTEL_MANAGER;
  }

  public isReceptionist(): boolean {
    return this.props.role === AdminRole.RECEPTIONIST;
  }

  public canManageHotel(): boolean {
    return this.props.role === AdminRole.SUPER_ADMIN || 
           this.props.role === AdminRole.HOTEL_MANAGER;
  }

  public canManageReservations(): boolean {
    return true; // Tous les admins peuvent gérer les réservations
  }

  public canManageAdmins(): boolean {
    return this.props.role === AdminRole.SUPER_ADMIN || 
           this.props.role === AdminRole.HOTEL_MANAGER;
  }

  public static create(role: AdminRole): AdminRoleVO {
    if (!Object.values(AdminRole).includes(role)) {
      throw new Error(`Invalid admin role: ${role}`);
    }
    return new AdminRoleVO({ role });
  }

  public static createSuperAdmin(): AdminRoleVO {
    return new AdminRoleVO({ role: AdminRole.SUPER_ADMIN });
  }

  public static createHotelManager(): AdminRoleVO {
    return new AdminRoleVO({ role: AdminRole.HOTEL_MANAGER });
  }

  public static createReceptionist(): AdminRoleVO {
    return new AdminRoleVO({ role: AdminRole.RECEPTIONIST });
  }
}
