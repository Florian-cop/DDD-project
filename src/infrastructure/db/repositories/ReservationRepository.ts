import { PrismaClient } from '@prisma/client';
import { IReservationRepository } from '@domain/reservation/repositories/IReservationRepository';
import { Reservation } from '@domain/reservation/entities/Reservation';
import { ReservationStatus, ReservationStatusEnum } from '@domain/reservation/value-objects/ReservationStatus';
import { DateRange } from '@domain/reservation/value-objects/DateRange';
import { RoomIds } from '@domain/reservation/value-objects/RoomIds';
import { TotalPrice } from '@domain/reservation/value-objects/TotalPrice';

type PrismaReservation = {
  id: string;
  customerId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  reservationRooms?: {
    roomId: string;
  }[];
};

export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
      }
    });
    
    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findOneById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
      }
    });

    if (!reservation) {
      return null;
    }

    return this.toDomain(reservation);
  }

  async findByCustomerId(customerId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { customerId },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        reservationRooms: {
          some: {
            roomId: roomId
          }
        }
      },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const prismaStatus = this.mapStatusToDb(status);
    
    const reservations = await this.prisma.reservation.findMany({
      where: { status: prismaStatus as any },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
      }
    });

    return reservations.map((reservation: PrismaReservation) => this.toDomain(reservation));
  }

  async findActiveReservations(): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: {
          in: ['BOOKED', 'CONFIRMED']
        }
      },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
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
          in: ['BOOKED', 'CONFIRMED']
        }
      },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
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
      },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
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
        reservationRooms: {
          some: {
            roomId: roomId
          }
        },
        status: {
          in: ['BOOKED', 'CONFIRMED']
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
      },
      include: {
        reservationRooms: {
          select: {
            roomId: true
          }
        }
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
    const statusDb = this.mapStatusToDb(entity.status.status);

    await this.prisma.$transaction(async (tx) => {
      await tx.reservation.upsert({
        where: { id: entity.id },
        create: {
          id: entity.id,
          customerId: entity.customerId,
          checkIn: entity.checkInDate,
          checkOut: entity.checkOutDate,
          totalPrice: totalPriceValue,
          status: statusDb as any,
          createdAt: entity.reservationDate
        },
        update: {
          checkIn: entity.checkInDate,
          checkOut: entity.checkOutDate,
          totalPrice: totalPriceValue,
          status: statusDb as any
        }
      });

      // Delete existing room associations
      await tx.reservationRoom.deleteMany({
        where: { reservationId: entity.id }
      });

      // Create new room associations
      const roomIds = entity.roomIds.value;
      if (roomIds.length > 0) {
        await tx.reservationRoom.createMany({
          data: roomIds.map(roomId => ({
            reservationId: entity.id,
            roomId: roomId
          }))
        });
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

    const roomIds = prismaReservation.reservationRooms?.map(rr => rr.roomId) || [];
    const roomIdsVO = RoomIds.create(roomIds);
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

  private mapStatusFromDb(dbStatus: string): ReservationStatus {
    switch (dbStatus) {
      case 'BOOKED':
        return ReservationStatus.createBooked();
      case 'CONFIRMED':
        return ReservationStatus.createConfirmed();
      case 'CANCELLED':
        return ReservationStatus.createCancelled();
      default:
        return ReservationStatus.createBooked();
    }
  }

  private mapStatusToDb(status: ReservationStatus): string {
    switch (status.value) {
      case ReservationStatusEnum.BOOKED:
        return 'BOOKED';
      case ReservationStatusEnum.CONFIRMED:
        return 'CONFIRMED';
      case ReservationStatusEnum.CANCELLED:
        return 'CANCELLED';
      default:
        return 'BOOKED';
    }
  }
}
