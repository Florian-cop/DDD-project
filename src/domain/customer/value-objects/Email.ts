import { ValueObject } from '../../../core/ValueObject';

interface IEmailProps {
  value: string;
}

export class Email extends ValueObject<IEmailProps> {
  private constructor(props: IEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: string): Email {
    const trimmedEmail = email.trim();
    if (!this.isValid(trimmedEmail)) {
      throw new Error(`Email "${email}" is not valid`);
    }
    return new Email({ value: trimmedEmail.toLowerCase() });
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
