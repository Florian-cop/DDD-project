import { Command } from 'commander';
import { CreateWalletService } from '@application/wallet/CreateWalletService';
import { GetWalletService } from '@application/wallet/GetWalletService';
import { GetAllWalletsService } from '@application/wallet/ListWalletService';
import { UpdateWalletService } from '@application/wallet/UpdateWalletService';
import { GetWalletQuery } from '@application/wallet/GetWalletQuery';
import { UpdateWalletCommand } from '@application/wallet/UpdateWalletCommand';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';
import { CustomerRepository } from '@infrastructure/db/repositories/CustomerRepository';
import { displaySuccess, displayError, displayTitle, displayWallet } from '../utils/display';
import { getPrismaClient } from '@infrastructure/db/prisma';
import chalk from 'chalk';

const prisma = getPrismaClient();
const walletRepository = new WalletRepository(prisma);
const customerRepository = new CustomerRepository(prisma);

export function registerWalletCommands(program: Command) {
  const wallet = program
    .command('wallet')
    .description('Gestion des portefeuilles');

  // Create wallet
  wallet
    .command('create')
    .description('Créer un portefeuille pour un client')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .action(async (options) => {
      try {
        const service = new CreateWalletService(walletRepository);
        const walletId = await service.execute(options.customerId);
        
        displayTitle('Portefeuille Créé');
        displaySuccess('Portefeuille créé avec succès!');
        console.log(chalk.bold('ID du portefeuille:'), chalk.green(walletId));
        console.log(chalk.bold('Solde initial:'), chalk.yellow('0.00 EUR'));
      } catch (error: any) {
        displayError(`Impossible de créer le portefeuille: ${error.message}`);
        process.exit(1);
      }
    });

  // Add funds
  wallet
    .command('add-funds')
    .description('Alimenter un portefeuille')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .requiredOption('-a, --amount <amount>', 'Montant à ajouter')
    .option('--currency <currency>', 'Devise (EUR, USD, GBP, JPY, CHF)', 'EUR')
    .action(async (options) => {
      try {
        const amount = parseFloat(options.amount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error('Le montant doit être un nombre positif');
        }

        const service = new UpdateWalletService(walletRepository, customerRepository);
        const command = new UpdateWalletCommand(
          options.customerId,
          amount,
          options.currency.toUpperCase()
        );
        await service.execute(command);
        
        displayTitle('Fonds Ajoutés');
        displaySuccess(`${amount} ${options.currency.toUpperCase()} ajoutés au portefeuille!`);
        
        // Display updated balance
        const getService = new GetWalletService(walletRepository, customerRepository);
        const query = new GetWalletQuery(options.customerId);
        const walletEntity = await getService.execute(query);
        console.log(chalk.bold('\nNouveau solde:'), chalk.green(`${walletEntity.balanceInEuros.toFixed(2)} EUR`));
      } catch (error: any) {
        displayError(`Impossible d'ajouter les fonds: ${error.message}`);
        process.exit(1);
      }
    });

  // Get wallet
  wallet
    .command('get')
    .description('Afficher un portefeuille')
    .requiredOption('-c, --customer-id <customerId>', 'ID du client')
    .action(async (options) => {
      try {
        const service = new GetWalletService(walletRepository, customerRepository);
        const query = new GetWalletQuery(options.customerId);
        const walletEntity = await service.execute(query);

        displayTitle('Détails du Portefeuille');
        displayWallet(walletEntity);
      } catch (error: any) {
        displayError(`Portefeuille introuvable: ${error.message}`);
        process.exit(1);
      }
    });

  // List all wallets
  wallet
    .command('list')
    .description('Lister tous les portefeuilles')
    .action(async () => {
      try {
        const service = new GetAllWalletsService(walletRepository);
        const wallets = await service.execute();

        displayTitle(`Liste des Portefeuilles (${wallets.length})`);
        
        if (wallets.length === 0) {
          console.log(chalk.gray('  Aucun portefeuille enregistré.'));
          return;
        }

        wallets.forEach((wallet: any, index: number) => {
          console.log(chalk.bold(`\n${index + 1}. Portefeuille`));
          console.log(chalk.gray('   ID:'), wallet.id);
          console.log(chalk.gray('   Client ID:'), wallet.idCustomer);
          console.log(chalk.gray('   Solde:'), chalk.green(`${wallet.balanceInEuros.toFixed(2)} EUR`));
        });
        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer les portefeuilles: ${error.message}`);
        process.exit(1);
      }
    });
}
