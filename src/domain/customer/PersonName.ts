import { ValueObject } from '../../core/ValueObject';

interface IPersonNameProps {
  firstname: string;
  lastname: string;
}

export class PersonName extends ValueObject<IPersonNameProps> {
  private constructor(props: IPersonNameProps) {
    super(props);
  }

  get firstname(): string {
    return this.props.firstname;
  }

  get lastname(): string {
    return this.props.lastname;
  }

  get fullname(): string {
    return `${this.props.firstname} ${this.props.lastname}`;
  }

  public static create(firstname: string, lastname: string): PersonName {
    if (!firstname || firstname.trim().length === 0) {
      throw new Error('Firstname cannot be empty');
    }
    
    if (!lastname || lastname.trim().length === 0) {
      throw new Error('Lastname cannot be empty');
    }

    if (firstname.length < 2) {
      throw new Error('Firstname must have at least 2 characters');
    }

    if (lastname.length < 2) {
      throw new Error('Lastname must have at least 2 characters');
    }

    return new PersonName({
      firstname: this.capitalize(firstname.trim()),
      lastname: this.capitalize(lastname.trim())
    });
  }

  private static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
