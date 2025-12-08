import { Command } from 'commander';
import { GetRoomStatisticsService } from '@application/statistics/GetRoomStatisticsService';
import { GetRoomReservationHistoryService } from '@application/statistics/GetRoomReservationHistoryService';
import { GetRoomStatisticsQuery } from '@application/statistics/GetRoomStatisticsQuery';
import { GetRoomReservationHistoryQuery } from '@application/statistics/GetRoomReservationHistoryQuery';
import { GetRoomService } from '@application/room/GetRoomService';
import { GetRoomQuery } from '@application/room/GetRoomQuery';
import { RoomRepository } from '@infrastructure/db/repositories/RoomRepository';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { displayError, displayTitle, displaySubtitle } from '../utils/display';
import { getPrismaClient } from '@infrastructure/db/prisma';
import chalk from 'chalk';

const prisma = getPrismaClient();
const roomRepository = new RoomRepository(prisma);
const reservationRepository = new ReservationRepository(prisma);

export function registerAdminCommands(program: Command) {
  const admin = program
    .command('admin')
    .description('Fonctionnalités administrateur');

  admin
    .command('statistics')
    .alias('stats')
    .description('Afficher les statistiques des chambres')
    .action(async () => {
      try {
        const service = new GetRoomStatisticsService(roomRepository);
        const query = new GetRoomStatisticsQuery();
        const stats = await service.execute(query);

        displayTitle('📊 Statistiques des Chambres');

        displaySubtitle('Vue d\'ensemble');
        console.log(chalk.bold('  Total de chambres:'), chalk.cyan(stats.totalRooms));
        console.log(chalk.bold('  Chambres disponibles:'), chalk.green(stats.availableRooms));
        console.log(chalk.bold('  Chambres occupées:'), chalk.red(stats.occupiedRooms));
        console.log(chalk.bold('  Taux d\'occupation:'), chalk.yellow(`${stats.occupancyRate}%`));

        displaySubtitle('Statistiques par Type');
        stats.byType.forEach(typeStats => {
          console.log(chalk.bold(`\n  ${typeStats.type}:`));
          console.log(chalk.gray('    Total:'), typeStats.total);
          console.log(chalk.gray('    Disponibles:'), chalk.green(typeStats.available));
          console.log(chalk.gray('    Occupées:'), chalk.red(typeStats.occupied));
          const occupancyRate = typeStats.total > 0 
            ? ((typeStats.occupied / typeStats.total) * 100).toFixed(2) 
            : '0.00';
          console.log(chalk.gray('    Taux d\'occupation:'), chalk.yellow(`${occupancyRate}%`));
        });

        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer les statistiques: ${error.message}`);
        process.exit(1);
      }
    });

  admin
    .command('history')
    .description('Afficher l\'historique des réservations pour une chambre')
    .requiredOption('-r, --room-id <roomId>', 'ID de la chambre')
    .option('-l, --limit <limit>', 'Nombre maximum de réservations à afficher', '10')
    .action(async (options) => {
      try {
        
        const getRoomService = new GetRoomService(roomRepository);
        const roomQuery = new GetRoomQuery(options.roomId);
        const room = await getRoomService.execute(roomQuery);
        
        const service = new GetRoomReservationHistoryService(reservationRepository, roomRepository);
        const query = new GetRoomReservationHistoryQuery(options.roomId);
        const history = await service.execute(query);

        const limit = parseInt(options.limit);
        const limitedHistory = history.slice(0, limit);

        displayTitle(`📜 Historique des Réservations - Chambre ${room.roomNumber.value}`);

        displaySubtitle('Informations de la Chambre');
        console.log(chalk.bold('  Numéro:'), room.roomNumber.value);
        console.log(chalk.bold('  Type:'), room.typeName);
        console.log(chalk.bold('  Prix/nuit:'), `${room.pricePerNight} EUR`);
        console.log(chalk.bold('  Disponible:'), room.isAvailable ? chalk.green('Oui') : chalk.red('Non'));

        displaySubtitle(`Historique (${limitedHistory.length} réservations)`);
        
        if (limitedHistory.length === 0) {
          console.log(chalk.gray('  Aucune réservation pour cette chambre.'));
        } else {
          limitedHistory.forEach((res: any, index: number) => {
            const statusLabel = res.status === 'BOOKED' 
              ? chalk.yellow('Réservé') 
              : res.status === 'CONFIRMED' 
              ? chalk.green('Confirmé') 
              : chalk.red('Annulé');

            console.log(chalk.bold(`\n  ${index + 1}. ${res.reservationId.substring(0, 8)}...`));
            console.log(chalk.gray('     Client:'), res.customerId.substring(0, 8) + '...');
            console.log(chalk.gray('     Check-in:'), res.checkIn.toLocaleDateString('fr-FR'));
            console.log(chalk.gray('     Check-out:'), res.checkOut.toLocaleDateString('fr-FR'));
            console.log(chalk.gray('     Prix:'), `${res.totalPrice} EUR`);
            console.log(chalk.gray('     Statut:'), statusLabel);
            console.log(chalk.gray('     Date résa:'), res.reservationDate.toLocaleDateString('fr-FR'));
          });
        }

        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer l'historique: ${error.message}`);
        process.exit(1);
      }
    });

  admin
    .command('dashboard')
    .description('Afficher le tableau de bord administrateur')
    .action(async () => {
      try {
        const statsService = new GetRoomStatisticsService(roomRepository);
        const statsQuery = new GetRoomStatisticsQuery();
        const stats = await statsService.execute(statsQuery);

        displayTitle('🎯 Tableau de Bord Administrateur');

        displaySubtitle('Vue d\'ensemble');
        console.log(chalk.bold('  Total de chambres:'), chalk.cyan(stats.totalRooms));
        console.log(chalk.bold('  Disponibles:'), chalk.green(`${stats.availableRooms} (${((stats.availableRooms / stats.totalRooms) * 100).toFixed(1)}%)`));
        console.log(chalk.bold('  Occupées:'), chalk.red(`${stats.occupiedRooms} (${stats.occupancyRate}%)`));

        displaySubtitle('Distribution par Type');
        stats.byType.forEach(typeStats => {
          const bar = '█'.repeat(Math.floor(typeStats.total / 2));
          const occupiedBar = '█'.repeat(Math.floor(typeStats.occupied / 2));
          console.log(`\n  ${chalk.bold(typeStats.type)}`);
          console.log(`  ${chalk.gray(bar)} ${typeStats.total} total`);
          console.log(`  ${chalk.red(occupiedBar)} ${typeStats.occupied} occupé(s)`);
        });

        console.log();
      } catch (error: any) {
        displayError(`Impossible d'afficher le tableau de bord: ${error.message}`);
        process.exit(1);
      }
    });
}
