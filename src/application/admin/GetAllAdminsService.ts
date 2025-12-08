import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';

export class GetAllAdminsService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(): Promise<Admin[]> {
    return await this.adminRepository.findAll();
  }
}
