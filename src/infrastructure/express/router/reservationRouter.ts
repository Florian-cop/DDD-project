import { Router } from 'express';
import { ReservationRepository } from '../../db/repositories/ReservationRepository';
import { WalletRepository } from '../../db/repositories/WalletRepository';
import { RoomRepository } from '../../db/repositories/RoomRepository';
import { CreateReservationService } from '../../../application/reservation/CreateReservationService';
import { ConfirmReservationService } from '../../../application/reservation/ConfirmReservationService';
import { CancelReservationService } from '../../../application/reservation/CancelReservationService';
import { CreateReservationController } from '../controllers/reservation/CreateReservationController';
import { ConfirmReservationController } from '../controllers/reservation/ConfirmReservationController';
import { CancelReservationController } from '../controllers/reservation/CancelReservationController';
import { getPrismaClient } from '../../db/prisma';
import { validate } from '../middleware/validate';
import { validateParams } from '../middleware/validateQuery';
import { createReservationSchema, uuidParamSchema } from '../validation/schemas';

export const createReservationRouter = (): Router => {
  const router = Router();
  const prisma = getPrismaClient();
  
  const reservationRepository = new ReservationRepository(prisma);
  const walletRepository = new WalletRepository(prisma);
  const roomRepository = new RoomRepository(prisma);
  
  const createReservationService = new CreateReservationService(reservationRepository, walletRepository, roomRepository, prisma);
  const confirmReservationService = new ConfirmReservationService(reservationRepository, walletRepository, roomRepository, prisma);
  const cancelReservationService = new CancelReservationService(reservationRepository, roomRepository, prisma);
  
  const createReservationController = new CreateReservationController(createReservationService);
  const confirmReservationController = new ConfirmReservationController(confirmReservationService);
  const cancelReservationController = new CancelReservationController(cancelReservationService);

  /**
   * @swagger
   * /api/reservations:
   *   post:
   *     summary: Créer une réservation
   *     description: Effectue une réservation pour une ou plusieurs chambres. Le client est débité de 50% du montant total.
   *     tags: [Reservations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerId
   *               - roomIds
   *               - checkInDate
   *               - checkOutDate
   *               - totalPrice
   *             properties:
   *               customerId:
   *                 type: string
   *                 format: uuid
   *                 description: ID du client
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               roomIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uuid
   *                 description: Liste des IDs des chambres à réserver
   *                 example: ["550e8400-e29b-41d4-a716-446655440001"]
   *               checkInDate:
   *                 type: string
   *                 format: date-time
   *                 description: Date d'arrivée (ISO 8601)
   *                 example: 2025-12-25T14:00:00Z
   *               checkOutDate:
   *                 type: string
   *                 format: date-time
   *                 description: Date de départ (ISO 8601)
   *                 example: 2025-12-27T11:00:00Z
   *               totalPrice:
   *                 type: number
   *                 description: Prix total de la réservation
   *                 example: 300
   *               currency:
   *                 type: string
   *                 enum: [EUR, USD, GBP, JPY, CHF]
   *                 default: EUR
   *                 description: Devise du paiement
   *     responses:
   *       201:
   *         description: Réservation créée avec succès (50% débité)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reservation'
   *       400:
   *         description: Erreur de validation ou fonds insuffisants
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/reservations', validate(createReservationSchema), (req, res) => createReservationController.handle(req, res));
  
  /**
   * @swagger
   * /api/reservations/{id}/confirm:
   *   post:
   *     summary: Confirmer une réservation
   *     description: Confirme une réservation en débitant les 50% restants du portefeuille du client
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la réservation à confirmer
   *     responses:
   *       200:
   *         description: Réservation confirmée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Reservation'
   *                 - type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: Réservation confirmée avec succès. Paiement du solde effectué.
   *       400:
   *         description: Réservation non BOOKED ou fonds insuffisants
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Réservation non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/reservations/:id/confirm', validateParams(uuidParamSchema), (req, res) => confirmReservationController.handle(req, res));
  
  /**
   * @swagger
   * /api/reservations/{id}/cancel:
   *   post:
   *     summary: Annuler une réservation
   *     description: Annule une réservation. Aucun remboursement n'est effectué selon la politique de l'hôtel.
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la réservation à annuler
   *     responses:
   *       200:
   *         description: Réservation annulée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                 customerId:
   *                   type: string
   *                   format: uuid
   *                 status:
   *                   type: string
   *                   example: CANCELLED
   *                 message:
   *                   type: string
   *                   example: Réservation annulée. Aucun remboursement effectué.
   *       400:
   *         description: Réservation déjà annulée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Réservation non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/reservations/:id/cancel', validateParams(uuidParamSchema), (req, res) => cancelReservationController.handle(req, res));
  
  return router;
};
