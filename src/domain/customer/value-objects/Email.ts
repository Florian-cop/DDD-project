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
    if (!this.isValid(email)) {
      throw new Error(`Email "${email}" is not valid`);
    }
    return new Email({ value: email.toLowerCase().trim() });
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
