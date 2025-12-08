import { Request, Response } from 'express';
import { ReleaseRoomService } from '../../../../application/room/ReleaseRoomService';
import { ReleaseRoomCommand } from '../../../../application/room/ReleaseRoomCommand';

export class ReleaseRoomController {
  constructor(private readonly releaseRoomService: ReleaseRoomService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { customerId, reservationId } = req.body;

      if (!roomId) {
        res.status(400).json({ error: 'Room ID is required' });
        return;
      }

      if (!customerId) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const command = new ReleaseRoomCommand(roomId, customerId, reservationId);

      const room = await this.releaseRoomService.execute(command);

      res.status(200).json({
        id: room.id,
        roomNumber: room.roomNumber.value,
        type: room.typeName,
        isAvailable: room.isAvailable,
        message: 'Room released successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else if (error.message.includes('not the owner') || error.message.includes('not part of')) {
          res.status(403).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
