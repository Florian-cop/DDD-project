import { Request, Response } from 'express';
import { ConfirmReservationService } from '../../../../application/reservation/ConfirmReservationService';
import { ConfirmReservationCommand } from '../../../../application/reservation/ConfirmReservationCommand';

export class ConfirmReservationController {
  constructor(private readonly confirmReservationService: ConfirmReservationService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const command: ConfirmReservationCommand = { id };

      const reservation = await this.confirmReservationService.execute(command);

      res.status(200).json({
        id: reservation.id,
        customerId: reservation.customerId,
        roomIds: reservation.roomIds.ids,
        checkInDate: reservation.dateRange.checkInDate,
        checkOutDate: reservation.dateRange.checkOutDate,
        totalPrice: reservation.totalPrice.amount,
        currency: reservation.totalPrice.currency,
        status: reservation.status.value,
        message: 'Réservation confirmée avec succès. Paiement du solde effectué.',
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
