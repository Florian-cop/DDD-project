import { ValueObject } from '../../../core/ValueObject';

interface IAddressProps {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export class Address extends ValueObject<IAddressProps> {
  private constructor(props: IAddressProps) {
    super(props);
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get country(): string {
    return this.props.country;
  }

  get fullAddress(): string {
    return `${this.props.street}, ${this.props.postalCode} ${this.props.city}, ${this.props.country}`;
  }

  public static create(
    street: string,
    city: string,
    postalCode: string,
    country: string
  ): Address {
    if (!street || street.trim().length === 0) {
      throw new Error('Street cannot be empty');
    }

    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }

    if (!postalCode || postalCode.trim().length === 0) {
      throw new Error('Postal code cannot be empty');
    }

    if (!country || country.trim().length === 0) {
      throw new Error('Country cannot be empty');
    }

    return new Address({
      street: street.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim()
    });
  }
}
