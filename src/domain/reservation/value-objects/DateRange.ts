import { ValueObject } from '../../../core/ValueObject';

interface IDateRangeProps {
  checkInDate: Date;
  checkOutDate: Date;
}

export class DateRange extends ValueObject<IDateRangeProps> {
  private constructor(props: IDateRangeProps) {
    super(props);
  }

  get checkInDate(): Date {
    return this.props.checkInDate;
  }

  get checkOutDate(): Date {
    return this.props.checkOutDate;
  }

  get numberOfNights(): number {
    const timeDiff = this.props.checkOutDate.getTime() - this.props.checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  public static create(checkInDate: Date, checkOutDate: Date): DateRange {
    // Validation : checkInDate doit être avant checkOutDate
    if (checkInDate >= checkOutDate) {
      throw new Error('Check-in date must be before check-out date');
    }

    // Validation : checkInDate ne peut pas être dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new Error('Check-in date cannot be in the past');
    }

    // Validation : durée minimum 1 nuit
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (nights < 1) {
      throw new Error('Reservation must be at least 1 night');
    }

    // Validation : durée maximum 30 nuits
    if (nights > 30) {
      throw new Error('Reservation cannot exceed 30 nights');
    }

    return new DateRange({
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate)
    });
  }

  public overlaps(other: DateRange): boolean {
    return this.props.checkInDate < other.checkOutDate && 
           this.props.checkOutDate > other.checkInDate;
  }

  public includes(date: Date): boolean {
    return date >= this.props.checkInDate && date < this.props.checkOutDate;
  }

  public isInFuture(): boolean {
    const now = new Date();
    return this.props.checkInDate > now;
  }

  public isPast(): boolean {
    const now = new Date();
    return this.props.checkOutDate < now;
  }

  public isCurrent(): boolean {
    const now = new Date();
    return this.props.checkInDate <= now && this.props.checkOutDate > now;
  }
}
