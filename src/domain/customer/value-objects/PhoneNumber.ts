import { ValueObject } from '../../../core/ValueObject';

interface IPhoneNumberProps {
  value: string;
}

export class PhoneNumber extends ValueObject<IPhoneNumberProps> {
  private constructor(props: IPhoneNumberProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(phoneNumber: string): PhoneNumber {
    const cleanedNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (!this.isValid(cleanedNumber)) {
      throw new Error(`Phone number "${phoneNumber}" is not valid`);
    }
    
    return new PhoneNumber({ value: cleanedNumber });
  }

  private static isValid(phoneNumber: string): boolean {
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    const internationalRegex = /^\+\d{10,15}$/;
    
    return phoneRegex.test(phoneNumber) || internationalRegex.test(phoneNumber);
  }

  public format(): string {
    const value = this.props.value;
    if (value.startsWith('+33')) {
      return value.replace(/^(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5 $6');
    } else if (value.startsWith('0')) {
      return value.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');
    }
    return value;
  }
}
