import { 
  ICustomerRepository, 
  Customer, 
  Email, 
  PersonName, 
  PhoneNumber 
} from '../domain/customer/index';
import { UpdateCustomerCommand } from './UpdateCustomerCommand';

export class UpdateCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOneById(command.id);
    
    if (!existingCustomer) {
      throw new Error(`Customer with id "${command.id}" not found`);
    }

    // Vérification de l'unicité de l'email si modifié
    if (command.email && command.email !== existingCustomer.email.value) {
      const emailVO = Email.create(command.email);
      const customerWithEmail = await this.customerRepository.findByEmail(emailVO);
      
      if (customerWithEmail && customerWithEmail.id !== command.id) {
        throw new Error(`Email "${command.email}" is already used by another customer`);
      }
    }

    // Créer les Value Objects si les champs sont fournis
    const email = command.email 
      ? Email.create(command.email) 
      : undefined;

    const name = (command.firstname || command.lastname)
      ? PersonName.create(
          command.firstname || existingCustomer.firstname,
          command.lastname || existingCustomer.lastname
        )
      : undefined;

    const phoneNumber = command.phoneNumber
      ? PhoneNumber.create(command.phoneNumber)
      : undefined;

    // Utiliser la méthode de mutation au lieu de recréer l'entité
    existingCustomer.updateContactInfo(email, name, phoneNumber);

    await this.customerRepository.save(existingCustomer);

    return existingCustomer;
  }
}
