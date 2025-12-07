import { Command } from 'commander';
import { CreateCustomerService } from '@application/customer/CreateCustomerService';
import { GetCustomerService } from '@application/customer/GetCustomerService';
import { GetAllCustomersService } from '@application/customer/GetAllCustomersService';
import { UpdateCustomerService } from '@application/customer/UpdateCustomerService';
import { DeleteCustomerService } from '@application/customer/DeleteCustomerService';
import { CustomerRepository } from '@infrastructure/db/repositories/CustomerRepository';
import { WalletRepository } from '@infrastructure/db/repositories/WalletRepository';
import { GetCustomerQuery } from '@application/customer/GetCustomerQuery';
import { displaySuccess, displayError, displayTitle, displayCustomer } from '../utils/display';
import { getPrismaClient } from '@infrastructure/db/prisma';
import chalk from 'chalk';

const prisma = getPrismaClient();
const customerRepository = new CustomerRepository(prisma);
const walletRepository = new WalletRepository(prisma);

export function registerCustomerCommands(program: Command) {
  const customer = program
    .command('customer')
    .description('Gestion des clients');

  customer
    .command('create')
    .description('Créer un nouveau client')
    .requiredOption('-e, --email <email>', 'Adresse email du client')
    .requiredOption('-f, --firstname <firstname>', 'Prénom')
    .requiredOption('-l, --lastname <lastname>', 'Nom de famille')
    .requiredOption('-p, --phone <phone>', 'Numéro de téléphone')
    .action(async (options) => {
      try {
        const service = new CreateCustomerService(customerRepository, walletRepository, prisma);
        const command = {
          email: options.email,
          firstname: options.firstname,
          lastname: options.lastname,
          phoneNumber: options.phone,
        };

        const customer = await service.execute(command);
        
        displayTitle('Client Créé');
        displaySuccess(`Client créé avec succès!`);
        console.log(chalk.bold('ID du client:'), chalk.green(customer.id));
        console.log('\n💡 Utilisez cet ID pour effectuer des opérations sur ce client.');
      } catch (error: any) {
        displayError(`Impossible de créer le client: ${error.message}`);
        process.exit(1);
      }
    });

  customer
    .command('list')
    .description('Lister tous les clients')
    .action(async () => {
      try {
        const service = new GetAllCustomersService(customerRepository);
        const customers = await service.execute();

        displayTitle(`Liste des Clients (${customers.length})`);
        
        if (customers.length === 0) {
          console.log(chalk.gray('  Aucun client enregistré.'));
          return;
        }

        customers.forEach((customer, index) => {
          console.log(chalk.bold(`\n${index + 1}. ${customer.fullname}`));
          console.log(chalk.gray('   ID:'), customer.id);
          console.log(chalk.gray('   Email:'), customer.email.value);
          console.log(chalk.gray('   Téléphone:'), customer.phoneNumber.value);
        });
        console.log();
      } catch (error: any) {
        displayError(`Impossible de récupérer les clients: ${error.message}`);
        process.exit(1);
      }
    });

  customer
    .command('get')
    .description('Afficher les détails d\'un client')
    .requiredOption('-i, --id <id>', 'ID du client')
    .action(async (options) => {
      try {
        const service = new GetCustomerService(customerRepository);
        const query = new GetCustomerQuery(options.id);
        const customerEntity = await service.execute(query);

        displayTitle('Détails du Client');
        displayCustomer(customerEntity);
      } catch (error: any) {
        displayError(`Client introuvable: ${error.message}`);
        process.exit(1);
      }
    });

  customer
    .command('update')
    .description('Mettre à jour un client')
    .requiredOption('-i, --id <id>', 'ID du client')
    .option('-e, --email <email>', 'Nouvelle adresse email')
    .option('-f, --firstname <firstname>', 'Nouveau prénom')
    .option('-l, --lastname <lastname>', 'Nouveau nom de famille')
    .option('-p, --phone <phone>', 'Nouveau numéro de téléphone')
    .action(async (options) => {
      try {
        const service = new UpdateCustomerService(customerRepository);
        const command = {
          id: options.id,
          email: options.email,
          firstname: options.firstname,
          lastname: options.lastname,
          phoneNumber: options.phone,
        };

        await service.execute(command);
        
        displaySuccess('Client mis à jour avec succès!');
      } catch (error: any) {
        displayError(`Impossible de mettre à jour le client: ${error.message}`);
        process.exit(1);
      }
    });

  customer
    .command('delete')
    .description('Supprimer un client')
    .requiredOption('-i, --id <id>', 'ID du client')
    .action(async (options) => {
      try {
        const service = new DeleteCustomerService(customerRepository);
        await service.execute({ id: options.id });
        
        displaySuccess('Client supprimé avec succès!');
      } catch (error: any) {
        displayError(`Impossible de supprimer le client: ${error.message}`);
        process.exit(1);
      }
    });
}
