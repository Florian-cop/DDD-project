import { Request, Response } from 'express';
import { CancelReservationService } from '../../../../application/reservation/CancelReservationService';
import { CancelReservationCommand } from '../../../../application/reservation/CancelReservationCommand';

export class CancelReservationController {
  constructor(private readonly cancelReservationService: CancelReservationService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const command: CancelReservationCommand = { id };

      const reservation = await this.cancelReservationService.execute(command);

      res.status(200).json({
        id: reservation.id,
        customerId: reservation.customerId,
        status: reservation.status.value,
        message: 'Réservation annulée. Aucun remboursement effectué.',
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
