import { Router } from 'express';
import { RoomRepository } from '../../db/repositories/RoomRepository';
import { ReservationRepository } from '../../db/repositories/ReservationRepository';
import { GetRoomStatisticsService } from '../../../application/statistics/GetRoomStatisticsService';
import { GetRoomReservationHistoryService } from '../../../application/statistics/GetRoomReservationHistoryService';
import { GetRoomStatisticsController } from '../controllers/admin/GetRoomStatisticsController';
import { GetRoomReservationHistoryController } from '../controllers/admin/GetRoomReservationHistoryController';
import { getPrismaClient } from '../../db/prisma';
import { validateParams, validateQuery } from '../middleware/validateQuery';
import { roomIdParamSchema, adminStatisticsQuerySchema, adminHistoryQuerySchema } from '../validation/schemas';

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
  
  /**
   * @swagger
   * /api/admin/rooms/statistics:
   *   get:
   *     summary: Statistiques globales des chambres
   *     description: Retourne les statistiques d'occupation et de revenus pour toutes les chambres
   *     tags: [Admin]
   *     responses:
   *       200:
   *         description: Statistiques récupérées avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalRooms:
   *                   type: integer
   *                   description: Nombre total de chambres
   *                   example: 50
   *                 availableRooms:
   *                   type: integer
   *                   description: Nombre de chambres disponibles
   *                   example: 15
   *                 occupancyRate:
   *                   type: number
   *                   format: float
   *                   description: Taux d'occupation en pourcentage
   *                   example: 70.5
   *                 totalRevenue:
   *                   type: number
   *                   description: Revenu total en EUR
   *                   example: 25000.50
   *                 byType:
   *                   type: object
   *                   description: Statistiques par type de chambre
   *                   properties:
   *                     STANDARD:
   *                       type: object
   *                       properties:
   *                         count:
   *                           type: integer
   *                           example: 30
   *                         available:
   *                           type: integer
   *                           example: 10
   *                         revenue:
   *                           type: number
   *                           example: 12000
   *                     DELUXE:
   *                       type: object
   *                       properties:
   *                         count:
   *                           type: integer
   *                           example: 15
   *                         available:
   *                           type: integer
   *                           example: 4
   *                         revenue:
   *                           type: number
   *                           example: 9000
   *                     SUITE:
   *                       type: object
   *                       properties:
   *                         count:
   *                           type: integer
   *                           example: 5
   *                         available:
   *                           type: integer
   *                           example: 1
   *                         revenue:
   *                           type: number
   *                           example: 4000
   */
  router.get('/admin/rooms/statistics', validateQuery(adminStatisticsQuerySchema), (req, res) => getRoomStatisticsController.handle(req, res));
  
  /**
   * @swagger
   * /api/admin/rooms/{roomId}/history:
   *   get:
   *     summary: Historique des réservations d'une chambre
   *     description: Retourne l'historique complet des réservations pour une chambre spécifique
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la chambre
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *           minimum: 1
   *           maximum: 100
   *         description: Nombre maximum de réservations à retourner
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [BOOKED, CONFIRMED, CANCELLED]
   *         description: Filtrer par statut de réservation
   *     responses:
   *       200:
   *         description: Historique récupéré avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 room:
   *                   $ref: '#/components/schemas/Room'
   *                 reservations:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Reservation'
   *                 totalReservations:
   *                   type: integer
   *                   description: Nombre total de réservations
   *                   example: 25
   *                 totalRevenue:
   *                   type: number
   *                   description: Revenu total généré par cette chambre
   *                   example: 5000.00
   *       404:
   *         description: Chambre non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/admin/rooms/:roomId/history', validateParams(roomIdParamSchema), validateQuery(adminHistoryQuerySchema), (req, res) => getRoomReservationHistoryController.handle(req, res));
  
  return router;
};
