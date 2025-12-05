import { IAdminRepository } from '../domain/admin/index';
import { DeleteAdminCommand } from './DeleteAdminCommand';

export class DeleteAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(command: DeleteAdminCommand): Promise<void> {
    const exists = await this.adminRepository.doesExists(command.id);

    if (!exists) {
      throw new Error(`Admin with id "${command.id}" not found`);
    }

    await this.adminRepository.delete(command.id);
  }
}
