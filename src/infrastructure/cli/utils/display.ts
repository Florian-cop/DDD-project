import chalk from 'chalk';

export const displaySuccess = (message: string) => {
  console.log(chalk.green('✅ ' + message));
};

export const displayError = (message: string) => {
  console.error(chalk.red('❌ ' + message));
};

export const displayWarning = (message: string) => {
  console.warn(chalk.yellow('⚠️  ' + message));
};

export const displayInfo = (message: string) => {
  console.log(chalk.blue('ℹ️  ' + message));
};

export const displayTitle = (title: string) => {
  console.log('\n' + chalk.bold.cyan('═'.repeat(60)));
  console.log(chalk.bold.cyan('  ' + title));
  console.log(chalk.bold.cyan('═'.repeat(60)) + '\n');
};

export const displaySubtitle = (subtitle: string) => {
  console.log(chalk.bold.magenta('\n▶ ' + subtitle));
};

export const displayTable = (data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    const formattedKey = chalk.bold(key.padEnd(20, ' ') + ':');
    console.log(`  ${formattedKey} ${value}`);
  });
};

export const displayList = (items: string[]) => {
  items.forEach(item => {
    console.log(chalk.gray('  • ') + item);
  });
};

export const displayCustomer = (customer: any) => {
  displaySubtitle('Informations Client');
  displayTable({
    'ID': customer.id,
    'Email': customer.email.value,
    'Nom complet': customer.fullname,
    'Téléphone': customer.phoneNumber.value,
  });
};

export const displayWallet = (wallet: any) => {
  displaySubtitle('Portefeuille');
  displayTable({
    'ID': wallet.id,
    'Client ID': wallet.idCustomer,
    'Solde': `${wallet.balanceInEuros.toFixed(2)} EUR`,
  });
};

export const displayRoom = (room: any) => {
  displaySubtitle('Informations Chambre');
  displayTable({
    'ID': room.id,
    'Numéro': room.roomNumber.value,
    'Type': room.typeName,
    'Prix/nuit': `${room.pricePerNight} EUR`,
    'Disponible': room.isAvailable ? chalk.green('Oui') : chalk.red('Non'),
  });
};

export const displayReservation = (reservation: any) => {
  displaySubtitle('Informations Réservation');
  displayTable({
    'ID': reservation.id,
    'Client ID': reservation.customerId,
    'Check-in': reservation.checkInDate.toLocaleDateString('fr-FR'),
    'Check-out': reservation.checkOutDate.toLocaleDateString('fr-FR'),
    'Nuits': reservation.numberOfNights,
    'Prix total': `${reservation.totalPrice.amount} ${reservation.totalPrice.currency}`,
    'Statut': getStatusLabel(reservation.status),
  });
};

const getStatusLabel = (status: any): string => {
  if (status.isBooked()) return chalk.yellow('Réservé');
  if (status.isConfirmed()) return chalk.green('Confirmé');
  if (status.isCancelled()) return chalk.red('Annulé');
  return 'Inconnu';
};
