import { Entity } from '../../../core/Entity';
import { DateRange } from '../value-objects/DateRange';
import { RoomIds } from '../value-objects/RoomIds';
import { TotalPrice } from '../value-objects/TotalPrice';
import { ReservationStatusVO, ReservationStatus } from '../value-objects/ReservationStatus';

export interface IReservationProps {
  customerId: string;
  roomIds: RoomIds;
  dateRange: DateRange;
  totalPrice: TotalPrice;
  reservationDate: Date;
  status: ReservationStatusVO;
}

export class Reservation extends Entity<IReservationProps> {
  private _customerId: string;
  private _roomIds: RoomIds;
  private _dateRange: DateRange;
  private _totalPrice: TotalPrice;
  private _reservationDate: Date;
  private _status: ReservationStatusVO;

  private constructor(props: IReservationProps, id?: string) {
    super(id);
    this._customerId = props.customerId;
    this._roomIds = props.roomIds;
    this._dateRange = props.dateRange;
    this._totalPrice = props.totalPrice;
    this._reservationDate = props.reservationDate;
    this._status = props.status;
  }

  get customerId(): string {
    return this._customerId;
  }

  get roomIds(): RoomIds {
    return this._roomIds;
  }

  get dateRange(): DateRange {
    return this._dateRange;
  }

  get checkInDate(): Date {
    return this._dateRange.checkInDate;
  }

  get checkOutDate(): Date {
    return this._dateRange.checkOutDate;
  }

  get numberOfNights(): number {
    return this._dateRange.numberOfNights;
  }

  get totalPrice(): TotalPrice {
    return this._totalPrice;
  }

  get reservationDate(): Date {
    return this._reservationDate;
  }

  get status(): ReservationStatusVO {
    return this._status;
  }

  // Méthodes métier
  public confirm(): void {
    if (!this._status.canBeConfirmed()) {
      throw new Error('Reservation cannot be confirmed in current status');
    }
    this._status = ReservationStatusVO.createConfirmed();
  }

  public cancel(): void {
    if (!this._status.canBeCancelled()) {
      throw new Error('Reservation cannot be cancelled in current status');
    }
    this._status = ReservationStatusVO.createCancelled();
  }

  public addRoom(roomId: string): void {
    this._roomIds = this._roomIds.addRoom(roomId);
  }

  public removeRoom(roomId: string): void {
    this._roomIds = this._roomIds.removeRoom(roomId);
  }

  public updateTotalPrice(newPrice: TotalPrice): void {
    if (this._status.isCancelled()) {
      throw new Error('Cannot update price of cancelled reservation');
    }
    this._totalPrice = newPrice;
  }

  public changeDates(newCheckInDate: Date, newCheckOutDate: Date): void {
    if (this._status.isCancelled()) {
      throw new Error('Cannot change dates of cancelled reservation');
    }

    if (this._status.isConfirmed()) {
      throw new Error('Cannot change dates of confirmed reservation. Please cancel and create a new reservation.');
    }

    this._dateRange = DateRange.create(newCheckInDate, newCheckOutDate);
  }

  public isActive(): boolean {
    return !this._status.isCancelled();
  }

  public isUpcoming(): boolean {
    return this.isActive() && this._dateRange.isInFuture();
  }

  public isCurrent(): boolean {
    return this.isActive() && this._dateRange.isCurrent();
  }

  public isPast(): boolean {
    return this._dateRange.isPast();
  }

  // Factory methods
  public static create(
    customerId: string,
    roomIds: string[],
    checkInDate: Date,
    checkOutDate: Date,
    totalPrice: number,
    currency: string = 'EUR',
    id?: string
  ): Reservation {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }

    const roomIdsVO = RoomIds.create(roomIds);
    const dateRangeVO = DateRange.create(checkInDate, checkOutDate);
    const totalPriceVO = TotalPrice.create(totalPrice, currency);
    const statusVO = ReservationStatusVO.createBooked();

    return new Reservation(
      {
        customerId: customerId.trim(),
        roomIds: roomIdsVO,
        dateRange: dateRangeVO,
        totalPrice: totalPriceVO,
        reservationDate: new Date(),
        status: statusVO
      },
      id
    );
  }

  public static fromValueObjects(props: IReservationProps, id?: string): Reservation {
    return new Reservation(props, id);
  }

  public static calculateTotalPrice(
    pricePerNight: number,
    numberOfRooms: number,
    numberOfNights: number,
    currency: string = 'EUR'
  ): TotalPrice {
    const total = pricePerNight * numberOfRooms * numberOfNights;
    return TotalPrice.create(total, currency);
  }
}
