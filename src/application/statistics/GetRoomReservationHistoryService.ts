import { IReservationRepository } from '@domain/reservation/repositories/IReservationRepository';
import { IRoomRepository } from '@domain/room/repositories/IRoomRepository';
import { GetRoomReservationHistoryQuery } from './GetRoomReservationHistoryQuery';

export interface ReservationHistoryItem {
  reservationId: string;
  customerId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
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
    
    const history: ReservationHistoryItem[] = reservations.map(reservation => ({
      reservationId: reservation.id,
      customerId: reservation.customerId,
      checkIn: reservation.dateRange.checkInDate,
      checkOut: reservation.dateRange.checkOutDate,
      totalPrice: reservation.totalPrice.amount,
      status: reservation.status.value,
      reservationDate: reservation.reservationDate
    }));

    history.sort((a, b) => b.reservationDate.getTime() - a.reservationDate.getTime());

    return history;
  }
}
