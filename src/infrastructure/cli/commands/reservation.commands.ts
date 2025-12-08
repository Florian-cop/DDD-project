import { Command } from 'commander';
import { CreateReservationService } from '@application/reservation/CreateReservationService';
import { ConfirmReservationService } from '@application/reservation/ConfirmReservationService';
import { CancelReservationService } from '@application/reservation/CancelReservationService';
import { GetReservationService } from '@application/reservation/GetReservationService';
import { GetAllReservationsService } from '@application/reservation/GetAllReservationsService';
import { GetReservationQuery } from '@application/reservation/GetReservationQuery';
import { CancelReservationCommand } from '@application/reservation/CancelReservationCommand';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';
import { RoomRepository } from '@infrastructure/db/repositories/RoomRepository';
import { displaySuccess, displayError, displayTitle, displayReservation, displaySubtitle } from '../utils/display';
import { getPrismaClient } from '@infrastructure/db/prisma';
import chalk from 'chalk';

const prisma = getPrismaClient();
const reservationRepository = new ReservationRepository(prisma);
const walletRepository = new WalletRepository(prisma);
const roomRepository = new RoomRepository(prisma);

export function registerReservationCommands(program: Command) {
  const reservation = program
    .command('reservation')
    .description('Gestion des réservations');

  reservation
    .command('create')
    .description('Effectuer une réservation')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .requiredOption('-r, --room-ids <roomIds>', 'IDs des chambres (séparés par des virgules)')
    .requiredOption('-i, --check-in <checkIn>', 'Date de check-in (YYYY-MM-DD)')
    .requiredOption('-o, --check-out <checkOut>', 'Date de check-out (YYYY-MM-DD)')
    .option('--currency <currency>', 'Devise (EUR, USD, GBP, JPY, CHF)', 'EUR')
    .action(async (options) => {
      try {
        const roomIds = options.roomIds.split(',').map((id: string) => id.trim());
        const checkIn = new Date(options.checkIn);
        const checkOut = new Date(options.checkOut);
        
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
          throw new Error('Format de date invalide. Utilisez YYYY-MM-DD');
        }

        const service = new CreateReservationService(
          reservationRepository,
          walletRepository,
          prisma
        );

        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        const totalPrice = roomIds.length * nights * 50;
        
        const command = {
          customerId: options.customerId,
          roomIds,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          totalPrice,
          currency: options.currency.toUpperCase(),
        };

        const reservation = await service.execute(command);
        const reservationId = reservation.id;
        
        displayTitle('Réservation Créée');
        displaySuccess('Réservation effectuée avec succès!');
        console.log(chalk.bold('ID de la réservation:'), chalk.green(reservationId));
        console.log(chalk.yellow('\n💰 50% du montant total a été débité de votre portefeuille.'));
        console.log(chalk.yellow('💡 Confirmez votre réservation pour payer les 50% restants.\n'));
      } catch (error: any) {
        displayError(`Impossible de créer la réservation: ${error.message}`);
        process.exit(1);
      }
    });

  reservation
    .command('confirm')
    .description('Confirmer une réservation (payer les 50% restants)')
    .requiredOption('-i, --id <id>', 'ID de la réservation')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .action(async (options) => {
      try {
        const service = new ConfirmReservationService(
          reservationRepository,
          walletRepository,
          roomRepository,
          prisma
        );
        
        await service.execute({
          id: options.id,
        });
        
        displayTitle('Réservation Confirmée');
        displaySuccess('Réservation confirmée avec succès!');
        console.log(chalk.green('\n✅ Les 50% restants ont été débités de votre portefeuille.'));
        console.log(chalk.green('✅ Votre réservation est maintenant confirmée!\n'));
      } catch (error: any) {
        displayError(`Impossible de confirmer la réservation: ${error.message}`);
        process.exit(1);
      }
    });

  reservation
    .command('cancel')
    .description('Annuler une réservation (aucun remboursement)')
    .requiredOption('-i, --id <id>', 'ID de la réservation')
    .action(async (options) => {
      try {
        const service = new CancelReservationService(reservationRepository, roomRepository, prisma);
        const command = new CancelReservationCommand(options.id);
        await service.execute(command);
        
        displayTitle('Réservation Annulée');
        displaySuccess('Réservation annulée avec succès!');
        console.log(chalk.red('\n⚠️  Attention: Les montants payés ne sont PAS remboursés.\n'));
      } catch (error: any) {
        displayError(`Impossible d'annuler la réservation: ${error.message}`);
        process.exit(1);
      }
    });

  reservation
    .command('get')
    .description('Afficher les détails d\'une réservation')
    .requiredOption('-i, --id <id>', 'ID de la réservation')
    .action(async (options) => {
      try {
        const service = new GetReservationService(reservationRepository);
        const query = new GetReservationQuery(options.id);
        const reservationEntity = await service.execute(query);

        displayTitle('Détails de la Réservation');
        displayReservation(reservationEntity);
      } catch (error: any) {
        displayError(`Réservation introuvable: ${error.message}`);
        process.exit(1);
      }
    });

  reservation
    .command('list')
    .description('Lister toutes les réservations')
    .option('-c, --customer-id <customerId>', 'Filtrer par client')
    .option('-s, --status <status>', 'Filtrer par statut (BOOKED, CONFIRMED, CANCELLED)')
    .action(async (options) => {
      try {
        const service = new GetAllReservationsService(reservationRepository);
        let reservations = await service.execute();

        if (options.customerId) {
          reservations = reservations.filter(r => r.customerId === options.customerId);
        }
        if (options.status) {
          const statusFilter = options.status.toUpperCase();
          reservations = reservations.filter(r => {
            if (statusFilter === 'BOOKED') return r.status.isBooked();
            if (statusFilter === 'CONFIRMED') return r.status.isConfirmed();
            if (statusFilter === 'CANCELLED') return r.status.isCancelled();
            return false;
          });
        }

        displayTitle(`Liste des Réservations (${reservations.length})`);
        
        if (reservations.length === 0) {
          console.log(chalk.gray('  Aucune réservation trouvée.'));
          return;
        }

        reservations.forEach((res, index) => {
          const statusLabel = res.status.isBooked() 
            ? chalk.yellow('Réservé') 
            : res.status.isConfirmed() 
            ? chalk.green('Confirmé') 
            : chalk.red('Annulé');

          console.log(chalk.bold(`\n${index + 1}. Réservation ${res.id.substring(0, 8)}...`));
          console.log(chalk.gray('   Client:'), res.customerId.substring(0, 8) + '...');
          console.log(chalk.gray('   Dates:'), `${res.checkInDate.toLocaleDateString('fr-FR')} → ${res.checkOutDate.toLocaleDateString('fr-FR')}`);
          console.log(chalk.gray('   Nuits:'), res.numberOfNights);
          console.log(chalk.gray('   Prix:'), `${res.totalPrice.amount} ${res.totalPrice.currency}`);
          console.log(chalk.gray('   Statut:'), statusLabel);
        });
        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer les réservations: ${error.message}`);
        process.exit(1);
      }
    });
}
