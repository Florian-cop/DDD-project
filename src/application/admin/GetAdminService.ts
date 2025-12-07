import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { GetAdminQuery } from './GetAdminQuery';

export class GetAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(query: GetAdminQuery): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneById(query.adminId);

    if (!admin) {
      throw new Error(`Admin with id "${query.adminId}" not found`);
    }

    return admin;
  }
}
