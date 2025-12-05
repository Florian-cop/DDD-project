import { IAdminRepository, Admin } from '@domain/admin';

export class GetAllAdminsService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(): Promise<Admin[]> {
    return await this.adminRepository.findAll();
  }
}
