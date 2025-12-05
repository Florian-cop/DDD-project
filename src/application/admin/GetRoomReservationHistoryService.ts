import { IReservationRepository } from '@domain/reservation/repositories/IReservationRepository';
import { IRoomRepository } from '@domain/room/repositories/IRoomRepository';
import { GetRoomReservationHistoryQuery } from './GetRoomReservationHistoryQuery';
import { Reservation } from '@domain/reservation/entities/Reservation';

export interface ReservationHistoryItem {
  reservationId: string;
  customerId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  totalPrice: string;
  status: string;
  reservationDate: Date;
}

export class GetRoomReservationHistoryService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(query: GetRoomReservationHistoryQuery): Promise<ReservationHistoryItem[]> {
    const room = await this.roomRepository.findOneById(query.roomId);

    if (!room) {
      throw new Error(`Room with id "${query.roomId}" not found`);
    }

    const reservations = await this.reservationRepository.findByRoomId(query.roomId);

    const sortedReservations = reservations.sort((a, b) => 
      b.reservationDate.getTime() - a.reservationDate.getTime()
    );

    return sortedReservations.map(reservation => this.toHistoryItem(reservation));
  }

  private toHistoryItem(reservation: Reservation): ReservationHistoryItem {
    return {
      reservationId: reservation.id,
      customerId: reservation.customerId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfNights: reservation.numberOfNights,
      totalPrice: reservation.totalPrice.format(),
      status: reservation.status.value,
      reservationDate: reservation.reservationDate
    };
  }
}
