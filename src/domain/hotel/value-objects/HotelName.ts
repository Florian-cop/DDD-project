import { ValueObject } from '../../../core/ValueObject';

interface IHotelNameProps {
  value: string;
}

export class HotelName extends ValueObject<IHotelNameProps> {
  private constructor(props: IHotelNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): HotelName {
    if (!name || name.trim().length === 0) {
      throw new Error('Hotel name cannot be empty');
    }

    if (name.trim().length < 3) {
      throw new Error('Hotel name must have at least 3 characters');
    }

    if (name.trim().length > 100) {
      throw new Error('Hotel name cannot exceed 100 characters');
    }

    return new HotelName({ value: name.trim() });
  }
}
