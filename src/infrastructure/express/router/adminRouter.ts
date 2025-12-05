import { Router } from 'express';
import { RoomRepository } from '../../db/repositories/RoomRepository';
import { ReservationRepository } from '../../db/repositories/ReservationRepository';
import { GetRoomStatisticsService } from '../../../application/admin/GetRoomStatisticsService';
import { GetRoomReservationHistoryService } from '../../../application/admin/GetRoomReservationHistoryService';
import { GetRoomStatisticsController } from '../controllers/admin/GetRoomStatisticsController';
import { GetRoomReservationHistoryController } from '../controllers/admin/GetRoomReservationHistoryController';
import { getPrismaClient } from '../../db/prisma';

export const createAdminRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const roomRepository = new RoomRepository(prisma);
  const reservationRepository = new ReservationRepository(prisma);
  
  const getRoomStatisticsService = new GetRoomStatisticsService(roomRepository);
  const getRoomReservationHistoryService = new GetRoomReservationHistoryService(
    reservationRepository,
    roomRepository
  );
  
  const getRoomStatisticsController = new GetRoomStatisticsController(getRoomStatisticsService);
  const getRoomReservationHistoryController = new GetRoomReservationHistoryController(
    getRoomReservationHistoryService
  );
  
  router.get('/admin/rooms/statistics', (req, res) => getRoomStatisticsController.handle(req, res));
  router.get('/admin/rooms/:roomId/history', (req, res) => getRoomReservationHistoryController.handle(req, res));
  
  return router;
};
