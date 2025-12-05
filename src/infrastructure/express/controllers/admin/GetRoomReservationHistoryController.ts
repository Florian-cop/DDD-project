import { Request, Response } from 'express';
import { GetRoomReservationHistoryService } from '../../../../application/admin/GetRoomReservationHistoryService';
import { GetRoomReservationHistoryQuery } from '../../../../application/admin/GetRoomReservationHistoryQuery';

export class GetRoomReservationHistoryController {
  constructor(private readonly getRoomReservationHistoryService: GetRoomReservationHistoryService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        res.status(400).json({ error: 'Room ID is required' });
        return;
      }

      const query = new GetRoomReservationHistoryQuery(roomId);

      const history = await this.getRoomReservationHistoryService.execute(query);

      res.status(200).json({
        roomId,
        totalReservations: history.length,
        reservations: history
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
