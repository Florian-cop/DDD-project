import { ValueObject } from '../../../core/ValueObject';

interface IRoomNumberProps {
  value: string;
}

export class RoomNumber extends ValueObject<IRoomNumberProps> {
  private constructor(props: IRoomNumberProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(roomNumber: string): RoomNumber {
    if (!roomNumber || roomNumber.trim().length === 0) {
      throw new Error('Room number cannot be empty');
    }

    const trimmedNumber = roomNumber.trim().toUpperCase();

    // Validation: format XXX ou X-XXX (ex: 101, 1-01, A-101, A101)
    const roomNumberRegex = /^[A-Z0-9]{1,4}(-[A-Z0-9]{1,3})?$/;
    if (!roomNumberRegex.test(trimmedNumber)) {
      throw new Error(`Room number "${roomNumber}" is not valid. Expected format: XXX or X-XXX`);
    }

    return new RoomNumber({ value: trimmedNumber });
  }
}
