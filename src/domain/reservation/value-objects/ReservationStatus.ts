import { ValueObject } from '../../../core/ValueObject';

export enum ReservationStatus {
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

interface IReservationStatusProps {
  status: ReservationStatus;
}

export class ReservationStatusVO extends ValueObject<IReservationStatusProps> {
  private constructor(props: IReservationStatusProps) {
    super(props);
  }

  get status(): ReservationStatus {
    return this.props.status;
  }

  get label(): string {
    switch (this.props.status) {
      case ReservationStatus.BOOKED:
        return 'Booked';
      case ReservationStatus.CONFIRMED:
        return 'Confirmed';
      case ReservationStatus.CANCELLED:
        return 'Cancelled';
    }
  }

  public isBooked(): boolean {
    return this.props.status === ReservationStatus.BOOKED;
  }

  public isConfirmed(): boolean {
    return this.props.status === ReservationStatus.CONFIRMED;
  }

  public isCancelled(): boolean {
    return this.props.status === ReservationStatus.CANCELLED;
  }

  public canBeConfirmed(): boolean {
    return this.props.status === ReservationStatus.BOOKED;
  }

  public canBeCancelled(): boolean {
    return this.props.status === ReservationStatus.BOOKED || 
           this.props.status === ReservationStatus.CONFIRMED;
  }

  public static create(status: ReservationStatus): ReservationStatusVO {
    if (!Object.values(ReservationStatus).includes(status)) {
      throw new Error(`Invalid reservation status: ${status}`);
    }
    return new ReservationStatusVO({ status });
  }

  public static createBooked(): ReservationStatusVO {
    return new ReservationStatusVO({ status: ReservationStatus.BOOKED });
  }

  public static createConfirmed(): ReservationStatusVO {
    return new ReservationStatusVO({ status: ReservationStatus.CONFIRMED });
  }

  public static createCancelled(): ReservationStatusVO {
    return new ReservationStatusVO({ status: ReservationStatus.CANCELLED });
  }
}
