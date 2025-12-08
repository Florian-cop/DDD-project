import { ValueObject } from '../../../core/ValueObject';

export enum ReservationStatusEnum {
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

interface IReservationStatusProps {
  status: ReservationStatusEnum;
}

export class ReservationStatus extends ValueObject<IReservationStatusProps> {
  private constructor(props: IReservationStatusProps) {
    super(props);
  }

  get status(): ReservationStatusEnum {
    return this.props.status;
  }

  get value(): ReservationStatusEnum {
    return this.props.status;
  }

  get label(): string {
    switch (this.props.status) {
      case ReservationStatusEnum.BOOKED:
        return 'Booked';
      case ReservationStatusEnum.CONFIRMED:
        return 'Confirmed';
      case ReservationStatusEnum.CANCELLED:
        return 'Cancelled';
    }
  }

  public isBooked(): boolean {
    return this.props.status === ReservationStatusEnum.BOOKED;
  }

  public isConfirmed(): boolean {
    return this.props.status === ReservationStatusEnum.CONFIRMED;
  }

  public isCancelled(): boolean {
    return this.props.status === ReservationStatusEnum.CANCELLED;
  }

  public canBeConfirmed(): boolean {
    return this.props.status === ReservationStatusEnum.BOOKED;
  }

  public canBeCancelled(): boolean {
    return this.props.status === ReservationStatusEnum.BOOKED || 
           this.props.status === ReservationStatusEnum.CONFIRMED;
  }

  public static create(status: ReservationStatusEnum): ReservationStatus {
    if (!Object.values(ReservationStatusEnum).includes(status)) {
      throw new Error(`Invalid reservation status: ${status}`);
    }
    return new ReservationStatus({ status });
  }

  public static createBooked(): ReservationStatus {
    return new ReservationStatus({ status: ReservationStatusEnum.BOOKED });
  }

  public static createConfirmed(): ReservationStatus {
    return new ReservationStatus({ status: ReservationStatusEnum.CONFIRMED });
  }

  public static createCancelled(): ReservationStatus {
    return new ReservationStatus({ status: ReservationStatusEnum.CANCELLED });
  }
}
