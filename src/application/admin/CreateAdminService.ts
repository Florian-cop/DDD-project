import { IAdminRepository, Admin } from '../domain/admin/index';
import { ICustomerRepository } from '../domain/customer/index';
import { CreateAdminCommand } from './CreateAdminCommand';

export class CreateAdminService {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly customerRepository: ICustomerRepository
  ) {}

  async execute(command: CreateAdminCommand): Promise<Admin> {
    // Vérifier que le customer existe
    const customer = await this.customerRepository.findOneById(command.customerId);
    
    if (!customer) {
      throw new Error(`Customer with id "${command.customerId}" not found`);
    }

    // Vérifier qu'il n'est pas déjà admin
    const existingAdmin = await this.adminRepository.findByCustomerId(command.customerId);
    
    if (existingAdmin) {
      throw new Error(`Customer with id "${command.customerId}" is already an admin`);
    }

    const admin = Admin.create(
      command.customerId,
      command.role,
      command.hotelId
    );

    await this.adminRepository.save(admin);

    return admin;
  }
}
