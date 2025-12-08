import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { CreateAdminCommand } from './CreateAdminCommand';
import { AdminRole } from '@domain/admin/value-objects/AdminRole';
import { Email } from '@domain/customer/value-objects/Email';

export class CreateAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(command: CreateAdminCommand): Promise<Admin> {
    const emailVO = Email.create(command.email);
    const existingAdmin = await this.adminRepository.findByEmail(emailVO);

    if (existingAdmin) {
      throw new Error(`Admin with email "${command.email}" already exists`);
    }

    const role = (command.role as AdminRole) || AdminRole.ADMIN;

    const admin = Admin.create(
      command.email,
      command.firstname,
      command.lastname,
      command.phoneNumber,
      role
    );

    await this.adminRepository.save(admin);

    return admin;
  }
}
