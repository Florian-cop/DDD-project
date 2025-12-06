import { Command } from 'commander';
import { CreateRoomService } from '@application/room/CreateRoomService';
import { GetRoomService } from '@application/room/GetRoomService';
import { GetAllRoomsService } from '@application/room/GetAllRoomsService';
import { ReleaseRoomService } from '@application/room/ReleaseRoomService';
import { GetRoomQuery } from '@application/room/GetRoomQuery';
import { ReleaseRoomCommand } from '@application/room/ReleaseRoomCommand';
import { RoomRepository } from '@infrastructure/db/repositories/RoomRepository';
import { ReservationRepository } from '@infrastructure/db/repositories/ReservationRepository';
import { displaySuccess, displayError, displayTitle, displayRoom, displaySubtitle } from '../utils/display';
import { getPrismaClient } from '@infrastructure/db/prisma';
import chalk from 'chalk';

const prisma = getPrismaClient();
const roomRepository = new RoomRepository(prisma);
const reservationRepository = new ReservationRepository(prisma);

export function registerRoomCommands(program: Command) {
  const room = program
    .command('room')
    .description('Gestion des chambres');

  // Create room
  room
    .command('create')
    .description('Créer une nouvelle chambre')
    .requiredOption('-n, --number <number>', 'Numéro de la chambre')
    .requiredOption('-t, --type <type>', 'Type de chambre (STANDARD, DELUXE, SUITE)')
    .action(async (options) => {
      try {
        const type = options.type.toUpperCase();
        if (!['STANDARD', 'DELUXE', 'SUITE'].includes(type)) {
          throw new Error('Le type doit être STANDARD, DELUXE ou SUITE');
        }

        const service = new CreateRoomService(roomRepository);
        const room = await service.execute({
          roomNumber: options.number,
          type: type,
          isAvailable: true,
        });

        const roomId = room.id;
        
        displayTitle('Chambre Créée');
        displaySuccess('Chambre créée avec succès!');
        console.log(chalk.bold('ID de la chambre:'), chalk.green(roomId));
        
        // Get room details
        const getService = new GetRoomService(roomRepository);
        const query = new GetRoomQuery(roomId);
        const roomEntity = await getService.execute(query);
        console.log(chalk.bold('Numéro:'), roomEntity.roomNumber.value);
        console.log(chalk.bold('Type:'), roomEntity.typeName);
        console.log(chalk.bold('Prix/nuit:'), `${roomEntity.pricePerNight} EUR`);
      } catch (error: any) {
        displayError(`Impossible de créer la chambre: ${error.message}`);
        process.exit(1);
      }
    });

  // List all rooms
  room
    .command('list')
    .description('Lister toutes les chambres')
    .option('-a, --available', 'Afficher uniquement les chambres disponibles')
    .option('-t, --type <type>', 'Filtrer par type (STANDARD, DELUXE, SUITE)')
    .action(async (options) => {
      try {
        const service = new GetAllRoomsService(roomRepository);
        let rooms = await service.execute();

        // Apply filters
        if (options.available) {
          rooms = rooms.filter(r => r.isAvailable);
        }
        if (options.type) {
          const typeFilter = options.type.toUpperCase();
          rooms = rooms.filter(r => r.typeName.includes(typeFilter));
        }

        displayTitle(`Liste des Chambres (${rooms.length})`);
        
        if (rooms.length === 0) {
          console.log(chalk.gray('  Aucune chambre trouvée.'));
          return;
        }

        // Group by type
        const roomsByType = {
          'Standard Room': rooms.filter(r => r.typeName === 'Standard Room'),
          'Deluxe Room': rooms.filter(r => r.typeName === 'Deluxe Room'),
          'Suite': rooms.filter(r => r.typeName === 'Suite'),
        };

        Object.entries(roomsByType).forEach(([type, typeRooms]) => {
          if (typeRooms.length > 0) {
            displaySubtitle(`${type} (${typeRooms.length})`);
            typeRooms.forEach((room) => {
              const status = room.isAvailable 
                ? chalk.green('✓ Disponible') 
                : chalk.red('✗ Occupée');
              console.log(`  ${chalk.bold(room.roomNumber.value)} - ${room.pricePerNight}€/nuit - ${status}`);
            });
          }
        });
        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer les chambres: ${error.message}`);
        process.exit(1);
      }
    });

  // Get room by ID
  room
    .command('get')
    .description('Afficher les détails d\'une chambre')
    .requiredOption('-i, --id <id>', 'ID de la chambre')
    .action(async (options) => {
      try {
        const service = new GetRoomService(roomRepository);
        const query = new GetRoomQuery(options.id);
        const roomEntity = await service.execute(query);

        displayTitle('Détails de la Chambre');
        displayRoom(roomEntity);
        
        // Display accessories
        displaySubtitle('Équipements');
        const accessories = [
          roomEntity.hasAccessory('bed') && 'Lit simple',
          roomEntity.hasAccessory('duoBed') && 'Lit double',
          roomEntity.hasAccessory('wifi') && 'WiFi',
          roomEntity.hasAccessory('tv') && 'TV',
          roomEntity.hasAccessory('flatScreenTv') && 'TV écran plat',
          roomEntity.hasAccessory('minibar') && 'Minibar',
          roomEntity.hasAccessory('airConditioning') && 'Climatiseur',
          roomEntity.hasAccessory('bathtub') && 'Baignoire',
          roomEntity.hasAccessory('terrace') && 'Terrasse',
        ].filter(Boolean);
        
        accessories.forEach(acc => console.log(chalk.gray('  • ') + acc));
      } catch (error: any) {
        displayError(`Chambre introuvable: ${error.message}`);
        process.exit(1);
      }
    });

  // Release room
  room
    .command('release')
    .description('Libérer une chambre (la rendre disponible)')
    .requiredOption('-i, --id <id>', 'ID de la chambre')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .option('-r, --reservation-id <reservationId>', 'ID de la réservation (optionnel)')
    .action(async (options) => {
      try {
        const service = new ReleaseRoomService(roomRepository, reservationRepository);
        const command = new ReleaseRoomCommand(
          options.id,
          options.customerId,
          options.reservationId
        );
        await service.execute(command);
        
        displaySuccess('Chambre libérée avec succès!');
      } catch (error: any) {
        displayError(`Impossible de libérer la chambre: ${error.message}`);
        process.exit(1);
      }
    });

  // Display room info (public feature)
  room
    .command('info')
    .description('Afficher les informations des types de chambres')
    .action(() => {
      displayTitle('Informations sur les Types de Chambres');
      
      console.log(chalk.bold.yellow('📦 Chambre Standard - 50€/nuit'));
      console.log(chalk.gray('  • Lit 1 place'));
      console.log(chalk.gray('  • WiFi'));
      console.log(chalk.gray('  • TV'));
      
      console.log(chalk.bold.yellow('\n📦 Chambre Supérieure - 100€/nuit'));
      console.log(chalk.gray('  • Lit 2 places'));
      console.log(chalk.gray('  • WiFi'));
      console.log(chalk.gray('  • TV écran plat'));
      console.log(chalk.gray('  • Minibar'));
      console.log(chalk.gray('  • Climatiseur'));
      
      console.log(chalk.bold.yellow('\n📦 Suite - 200€/nuit'));
      console.log(chalk.gray('  • Lit 2 places'));
      console.log(chalk.gray('  • WiFi'));
      console.log(chalk.gray('  • TV écran plat'));
      console.log(chalk.gray('  • Minibar'));
      console.log(chalk.gray('  • Climatiseur'));
      console.log(chalk.gray('  • Baignoire'));
      console.log(chalk.gray('  • Terrasse'));
      console.log();
    });
}
