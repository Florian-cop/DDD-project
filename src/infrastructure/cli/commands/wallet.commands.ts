import { Command } from 'commander';
import { GetWalletService } from '@application/wallet/GetWalletService';
import { GetAllWalletsService } from '@application/wallet/GetAllWalletsService';
import { AddFundsToWalletService } from '@application/wallet/AddFundsToWalletService';
import { GetWalletQuery } from '@application/wallet/GetWalletQuery';
import { AddFundsToWalletCommand } from '@application/wallet/AddFundsToWalletCommand';
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

        const service = new AddFundsToWalletService(walletRepository, customerRepository);
        const command = new AddFundsToWalletCommand(
          options.customerId,
          amount,
          options.currency.toUpperCase()
        );
        await service.execute(command);
        
        displayTitle('Fonds Ajoutés');
        displaySuccess(`${amount} ${options.currency.toUpperCase()} ajoutés au portefeuille!`);

        const getService = new GetWalletService(walletRepository, customerRepository);
        const query = new GetWalletQuery(options.customerId);
        const walletEntity = await getService.execute(query);
        console.log(chalk.bold('\nNouveau solde:'), chalk.green(`${walletEntity.balanceInEuros.toFixed(2)} EUR`));
      } catch (error: any) {
        displayError(`Impossible d'ajouter les fonds: ${error.message}`);
        process.exit(1);
      }
    });

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
