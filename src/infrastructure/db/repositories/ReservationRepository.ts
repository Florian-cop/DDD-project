import { PrismaClient } from '@prisma/client';
import { IReservationRepository } from '../../../domain/reservation/repositories/IReservationRepository';
import { Reservation } from '../../../domain/reservation/entities/Reservation';
import { ReservationStatus } from '../../../domain/reservation/value-objects/ReservationStatus';
import { DateRange } from '../../../domain/reservation/value-objects/DateRange';
import { RoomIds } from '../../../domain/reservation/value-objects/RoomIds';
import { TotalPrice } from '../../../domain/reservation/value-objects/TotalPrice';
import { ReservationStatusVO } from '../../../domain/reservation/value-objects/ReservationStatus';

type PrismaReservation = {
  id: string;
  customerId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany();
    
    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findOneById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      return null;
    }

    return this.toDomain(reservation);
  }

  async findByCustomerId(customerId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { customerId }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { roomId }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const prismaStatus = this.mapStatusToDb(status);
    
    const reservations = await this.prisma.reservation.findMany({
      where: { status: prismaStatus as any }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findActiveReservations(): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findUpcomingReservations(): Promise<Reservation[]> {
    const now = new Date();
    
    const reservations = await this.prisma.reservation.findMany({
      where: {
        checkIn: {
          gte: now
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        OR: [
          {
            checkIn: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            checkOut: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findConflictingReservations(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        roomId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            checkIn: {
              lt: checkOutDate,
              gte: checkInDate
            }
          },
          {
            checkOut: {
              gt: checkInDate,
              lte: checkOutDate
            }
          },
          {
            AND: [
              {
                checkIn: {
                  lte: checkInDate
                }
              },
              {
                checkOut: {
                  gte: checkOutDate
                }
              }
            ]
          }
        ]
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async doesExists(id: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: { id }
    });

    return count > 0;
  }

  async save(entity: Reservation): Promise<void> {
    const totalPriceValue = entity.totalPrice.amount;

    await this.prisma.reservation.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        customerId: entity.customerId,
        roomId: entity.roomIds.value[0],
        checkIn: entity.checkInDate,
        checkOut: entity.checkOutDate,
        totalPrice: totalPriceValue,
        status: this.mapStatusToDb(entity.status.status),
        createdAt: entity.reservationDate
      },
      update: {
        checkIn: entity.checkInDate,
        checkOut: entity.checkOutDate,
        totalPrice: totalPriceValue,
        status: this.mapStatusToDb(entity.status.status)
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reservation.delete({
      where: { id }
    });
  }

  private toDomain(prismaReservation: PrismaReservation): Reservation {
    const totalPrice = typeof prismaReservation.totalPrice === 'number'
      ? prismaReservation.totalPrice
      : parseFloat(prismaReservation.totalPrice.toString());

    const roomIdsVO = RoomIds.create([prismaReservation.roomId]);
    const dateRangeVO = DateRange.create(
      prismaReservation.checkIn,
      prismaReservation.checkOut
    );
    const totalPriceVO = TotalPrice.create(totalPrice, 'EUR');
    const statusVO = this.mapStatusFromDb(prismaReservation.status);

    return Reservation.fromValueObjects(
      {
        customerId: prismaReservation.customerId,
        roomIds: roomIdsVO,
        dateRange: dateRangeVO,
        totalPrice: totalPriceVO,
        reservationDate: prismaReservation.createdAt,
        status: statusVO
      },
      prismaReservation.id
    );
  }

  private mapStatusFromDb(dbStatus: string): ReservationStatusVO {
    switch (dbStatus) {
      case 'PENDING':
        return ReservationStatusVO.createBooked();
      case 'CONFIRMED':
        return ReservationStatusVO.createConfirmed();
      case 'CANCELLED':
        return ReservationStatusVO.createCancelled();
      case 'COMPLETED':
        return ReservationStatusVO.createConfirmed();
      default:
        return ReservationStatusVO.createBooked();
    }
  }

  private mapStatusToDb(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.BOOKED:
        return 'PENDING';
      case ReservationStatus.CONFIRMED:
        return 'CONFIRMED';
      case ReservationStatus.CANCELLED:
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  }
}
