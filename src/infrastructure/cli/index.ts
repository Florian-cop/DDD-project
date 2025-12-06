#!/usr/bin/env node

import 'tsconfig-paths/register';
import { Command } from 'commander';
import chalk from 'chalk';
import { registerCustomerCommands } from './commands/customer.commands';
import { registerWalletCommands } from './commands/wallet.commands';
import { registerRoomCommands } from './commands/room.commands';
import { registerReservationCommands } from './commands/reservation.commands';
import { registerAdminCommands } from './commands/admin.commands';
import { disconnectPrisma } from '../db/prisma';

const program = new Command();

program
  .name('hotel-cli')
  .description(chalk.blue.bold('🏨 XYZ Hotel - Système de gestion des réservations'))
  .version('1.0.0');

// Register all command groups
registerCustomerCommands(program);
registerWalletCommands(program);
registerRoomCommands(program);
registerReservationCommands(program);
registerAdminCommands(program);

// Global error handler
program.exitOverride();

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    if (error.code !== 'commander.help' && error.code !== 'commander.helpDisplayed') {
      process.exit(1);
    }
  } finally {
    await disconnectPrisma();
  }
}

main();
