import { IRepository } from '../../../core/IRepository';
import { Reservation } from '../entities/Reservation';
import { ReservationStatus } from '../value-objects/ReservationStatus';

export interface IReservationRepository extends IRepository<Reservation> {
  findByCustomerId(customerId: string): Promise<Reservation[]>;
  findByRoomId(roomId: string): Promise<Reservation[]>;
  findByStatus(status: ReservationStatus): Promise<Reservation[]>;
  findActiveReservations(): Promise<Reservation[]>;
  findUpcomingReservations(): Promise<Reservation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]>;
  findConflictingReservations(roomId: string, checkInDate: Date, checkOutDate: Date): Promise<Reservation[]>;
}
