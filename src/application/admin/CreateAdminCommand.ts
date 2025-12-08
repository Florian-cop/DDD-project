export class CreateAdminCommand {
  constructor(
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly phoneNumber: string,
    public readonly role?: string
  ) {
    if (!email || email.trim().length === 0) {
      throw new Error('Email is required');
    }

    if (!firstname || firstname.trim().length === 0) {
      throw new Error('Firstname is required');
    }

    if (!lastname || lastname.trim().length === 0) {
      throw new Error('Lastname is required');
    }

    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required');
    }
  }
}
