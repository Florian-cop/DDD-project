import { Request, Response } from 'express';
import { CreateReservationService } from '../../../../application/reservation/CreateReservationService';
import { CreateReservationCommand } from '../../../../application/reservation/CreateReservationCommand';

export class CreateReservationController {
  constructor(private readonly createReservationService: CreateReservationService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, roomIds, checkInDate, checkOutDate, totalPrice, currency } = req.body;

      const command: CreateReservationCommand = {
        customerId,
        roomIds,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice,
        currency: currency || 'EUR',
      };

      const reservation = await this.createReservationService.execute(command);

      res.status(201).json({
        id: reservation.id,
        customerId: reservation.customerId,
        roomIds: reservation.roomIds.ids,
        checkInDate: reservation.dateRange.checkInDate,
        checkOutDate: reservation.dateRange.checkOutDate,
        totalPrice: reservation.totalPrice.amount,
        currency: reservation.totalPrice.currency,
        status: reservation.status.value,
        reservationDate: reservation.reservationDate,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
