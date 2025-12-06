import { Router } from 'express';
import { RoomRepository } from '../../db/repositories/RoomRepository';
import { ReservationRepository } from '../../db/repositories/ReservationRepository';
import { ReleaseRoomService } from '../../../application/room/ReleaseRoomService';
import { ReleaseRoomController } from '../controllers/room/ReleaseRoomController';
import { getPrismaClient } from '../../db/prisma';
import { validate } from '../middleware/validate';
import { releaseRoomSchema } from '../validation/schemas';

export const createRoomRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const roomRepository = new RoomRepository(prisma);
  const reservationRepository = new ReservationRepository(prisma);
  
  const releaseRoomService = new ReleaseRoomService(roomRepository, reservationRepository);
  
  const releaseRoomController = new ReleaseRoomController(releaseRoomService);
  
  /**
   * @swagger
   * /api/rooms/{roomId}/release:
   *   post:
   *     summary: Libérer une chambre (check-out)
   *     tags: [Rooms]
   *     description: Libère une chambre à la fin d'un séjour client
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la chambre à libérer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerId
   *             properties:
   *               customerId:
   *                 type: string
   *                 format: uuid
   *                 description: ID du client qui libère la chambre
   *     responses:
   *       200:
   *         description: Chambre libérée avec succès
   *       400:
   *         description: Erreur de validation
   *       404:
   *         description: Chambre ou client non trouvé
   */
  router.post('/rooms/:roomId/release', validate(releaseRoomSchema), (req, res) => releaseRoomController.handle(req, res));
  
  return router;
};
