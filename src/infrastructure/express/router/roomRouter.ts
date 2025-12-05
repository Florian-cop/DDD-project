import { Router } from 'express';
import { RoomRepository } from '../../db/repositories/RoomRepository';
import { ReservationRepository } from '../../db/repositories/ReservationRepository';
import { ReleaseRoomService } from '../../../application/room/ReleaseRoomService';
import { ReleaseRoomController } from '../controllers/room/ReleaseRoomController';
import { getPrismaClient } from '../../db/prisma';

export const createRoomRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const roomRepository = new RoomRepository(prisma);
  const reservationRepository = new ReservationRepository(prisma);
  
  const releaseRoomService = new ReleaseRoomService(roomRepository, reservationRepository);
  
  const releaseRoomController = new ReleaseRoomController(releaseRoomService);
  
  router.post('/rooms/:roomId/release', (req, res) => releaseRoomController.handle(req, res));
  
  return router;
};
