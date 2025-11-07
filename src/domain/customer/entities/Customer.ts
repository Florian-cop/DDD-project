import { Entity } from '../../../core/Entity';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { PersonName } from '../value-objects/PersonName';

export interface ICustomerProps {
  email: Email;
  name: PersonName;
  phoneNumber: PhoneNumber;
}

export class Customer extends Entity<ICustomerProps> {
  private _email: Email;
  private _name: PersonName;
  private _phoneNumber: PhoneNumber;

  private constructor(props: ICustomerProps, id?: string) {
    super(id);
    this._email = props.email;
    this._name = props.name;
    this._phoneNumber = props.phoneNumber;
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

  get firstname(): string {
    return this._name.firstname;
  }

  get lastname(): string {
    return this._name.lastname;
  }

  get fullname(): string {
    return this._name.fullname;
  }

  public changeEmail(email: Email): void {
    this._email = email;
  }

  public changeName(name: PersonName): void {
    this._name = name;
  }

  public changePhoneNumber(phoneNumber: PhoneNumber): void {
    this._phoneNumber = phoneNumber;
  }

  public updateContactInfo(
    email?: Email,
    name?: PersonName,
    phoneNumber?: PhoneNumber
  ): void {
    if (email) this._email = email;
    if (name) this._name = name;
    if (phoneNumber) this._phoneNumber = phoneNumber;
  }

  public static create(
    email: string,
    firstname: string,
    lastname: string,
    phoneNumber: string,
    id?: string
  ): Customer {
    const emailVO = Email.create(email);
    const nameVO = PersonName.create(firstname, lastname);
    const phoneNumberVO = PhoneNumber.create(phoneNumber);

    return new Customer(
      {
        email: emailVO,
        name: nameVO,
        phoneNumber: phoneNumberVO
      },
      id
    );
  }

  public static fromValueObjects(props: ICustomerProps, id?: string): Customer {
    return new Customer(props, id);
  }
}
