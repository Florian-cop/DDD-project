import { IAdminRepository, Admin } from '@domain/admin';
import { GetAdminQuery } from './GetAdminQuery';

export class GetAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(query: GetAdminQuery): Promise<Admin> {
    const admin = await this.adminRepository.findOneById(query.id);

    if (!admin) {
      throw new Error(`Admin with id "${query.id}" not found`);
    }

    return admin;
  }
}
