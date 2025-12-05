import { Entity } from '@core/Entity';
import { Email } from '@domain/customer/value-objects/Email';
import { PersonName } from '@domain/customer/value-objects/PersonName';
import { PhoneNumber } from '@domain/customer/value-objects/PhoneNumber';
import { AdminRoleVO, AdminRole } from '../value-objects/AdminRole';

export interface IAdminProps {
  email: Email;
  name: PersonName;
  phoneNumber: PhoneNumber;
  role: AdminRoleVO;
  isActive: boolean;
  hiredDate: Date;
}

export class Admin extends Entity<IAdminProps> {
  private _email: Email;
  private _name: PersonName;
  private _phoneNumber: PhoneNumber;
  private _role: AdminRoleVO;
  private _isActive: boolean;
  private _hiredDate: Date;

  private constructor(props: IAdminProps, id?: string) {
    super(id);
    this._email = props.email;
    this._name = props.name;
    this._phoneNumber = props.phoneNumber;
    this._role = props.role;
    this._isActive = props.isActive;
    this._hiredDate = props.hiredDate;
  }

  get email(): Email {
    return this._email;
  }

  get name(): PersonName {
    return this._name;
  }

  get phoneNumber(): PhoneNumber {
    return this._phoneNumber;
  }

  get role(): AdminRoleVO {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get hiredDate(): Date {
    return this._hiredDate;
  }

  public updateEmail(newEmail: Email): void {
    this._email = newEmail;
  }

  public updateName(newName: PersonName): void {
    this._name = newName;
  }

  public updatePhoneNumber(newPhoneNumber: PhoneNumber): void {
    this._phoneNumber = newPhoneNumber;
  }

  public changeRole(newRole: AdminRoleVO): void {
    this._role = newRole;
  }

  public activate(): void {
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public static create(
    email: string,
    firstname: string,
    lastname: string,
    phoneNumber: string,
    role: AdminRole = AdminRole.ADMIN,
    id?: string
  ): Admin {
    const emailVO = Email.create(email);
    const nameVO = PersonName.create(firstname, lastname);
    const phoneNumberVO = PhoneNumber.create(phoneNumber);
    const roleVO = AdminRoleVO.create(role);

    return new Admin(
      {
        email: emailVO,
        name: nameVO,
        phoneNumber: phoneNumberVO,
        role: roleVO,
        isActive: true,
        hiredDate: new Date()
      },
      id
    );
  }

  public static fromValueObjects(props: IAdminProps, id?: string): Admin {
    return new Admin(props, id);
  }
}
