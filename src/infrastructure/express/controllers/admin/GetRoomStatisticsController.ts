import { Request, Response } from 'express';
import { GetRoomStatisticsService } from '../../../../application/statistics/GetRoomStatisticsService';
import { GetRoomStatisticsQuery } from '../../../../application/statistics/GetRoomStatisticsQuery';

export class GetRoomStatisticsController {
  constructor(private readonly getRoomStatisticsService: GetRoomStatisticsService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const query = new GetRoomStatisticsQuery();

      const statistics = await this.getRoomStatisticsService.execute(query);

      res.status(200).json(statistics);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
