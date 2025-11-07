import { Entity } from '../../../core/Entity';
import { Email } from '../../customer/value-objects/Email';
import { PersonName } from '../../customer/value-objects/PersonName';
import { PhoneNumber } from '../../customer/value-objects/PhoneNumber';
import { AdminRoleVO, AdminRole } from '../value-objects/AdminRole';

export interface IAdminProps {
  customerId: string; // Un Admin est un Customer avec des droits supplémentaires
  role: AdminRoleVO;
  hotelIds: string[]; // Hotels qu'il gère
  isActive: boolean;
  hiredDate: Date;
}

export class Admin extends Entity<IAdminProps> {
  private _customerId: string;
  private _role: AdminRoleVO;
  private _hotelIds: string[];
  private _isActive: boolean;
  private _hiredDate: Date;

  private constructor(props: IAdminProps, id?: string) {
    super(id);
    this._customerId = props.customerId;
    this._role = props.role;
    this._hotelIds = [...props.hotelIds];
    this._isActive = props.isActive;
    this._hiredDate = props.hiredDate;
  }

  get customerId(): string {
    return this._customerId;
  }

  get role(): AdminRoleVO {
    return this._role;
  }

  get hotelIds(): string[] {
    return [...this._hotelIds];
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get hiredDate(): Date {
    return this._hiredDate;
  }

  // Méthodes métier
  public assignToHotel(hotelId: string): void {
    if (!hotelId || hotelId.trim().length === 0) {
      throw new Error('Hotel ID cannot be empty');
    }

    if (this._hotelIds.includes(hotelId)) {
      throw new Error('Admin already assigned to this hotel');
    }

    // Super Admin peut gérer plusieurs hôtels
    if (!this._role.isSuperAdmin() && this._hotelIds.length > 0) {
      throw new Error('Only Super Admin can manage multiple hotels');
    }

    this._hotelIds.push(hotelId);
  }

  public unassignFromHotel(hotelId: string): void {
    const index = this._hotelIds.indexOf(hotelId);
    if (index === -1) {
      throw new Error('Admin not assigned to this hotel');
    }

    this._hotelIds.splice(index, 1);
  }

  public isAssignedToHotel(hotelId: string): boolean {
    return this._hotelIds.includes(hotelId);
  }

  public hasHotelAssignments(): boolean {
    return this._hotelIds.length > 0;
  }

  public changeRole(newRole: AdminRoleVO): void {
    // Si on passe de Super Admin à autre chose et qu'il gère plusieurs hôtels
    if (this._role.isSuperAdmin() && !newRole.isSuperAdmin() && this._hotelIds.length > 1) {
      throw new Error('Cannot change role: Admin manages multiple hotels. Unassign hotels first.');
    }

    this._role = newRole;
  }

  public activate(): void {
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public canManageHotel(hotelId: string): boolean {
    if (!this._isActive) {
      return false;
    }

    if (this._role.isSuperAdmin()) {
      return true; // Super admin peut tout gérer
    }

    return this.isAssignedToHotel(hotelId) && this._role.canManageHotel();
  }

  // Factory methods
  public static create(
    customerId: string,
    role: AdminRole,
    hotelId?: string,
    id?: string
  ): Admin {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }

    const roleVO = AdminRoleVO.create(role);
    const hotelIds = hotelId ? [hotelId.trim()] : [];

    return new Admin(
      {
        customerId: customerId.trim(),
        role: roleVO,
        hotelIds,
        isActive: true,
        hiredDate: new Date()
      },
      id
    );
  }

  public static createSuperAdmin(customerId: string, id?: string): Admin {
    return this.create(customerId, AdminRole.SUPER_ADMIN, undefined, id);
  }

  public static createHotelManager(customerId: string, hotelId: string, id?: string): Admin {
    if (!hotelId || hotelId.trim().length === 0) {
      throw new Error('Hotel Manager must be assigned to a hotel');
    }
    return this.create(customerId, AdminRole.HOTEL_MANAGER, hotelId, id);
  }

  public static createReceptionist(customerId: string, hotelId: string, id?: string): Admin {
    if (!hotelId || hotelId.trim().length === 0) {
      throw new Error('Receptionist must be assigned to a hotel');
    }
    return this.create(customerId, AdminRole.RECEPTIONIST, hotelId, id);
  }

  public static fromValueObjects(props: IAdminProps, id?: string): Admin {
    return new Admin(props, id);
  }
}
