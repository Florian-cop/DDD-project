import { IAdminRepository, Admin, AdminRoleVO } from '../domain/admin/index';
import { UpdateAdminCommand } from './UpdateAdminCommand';

export class UpdateAdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(command: UpdateAdminCommand): Promise<Admin> {
    const admin = await this.adminRepository.findOneById(command.id);

    if (!admin) {
      throw new Error(`Admin with id "${command.id}" not found`);
    }

    if (command.role) {
      const roleVO = AdminRoleVO.create(command.role);
      admin.changeRole(roleVO);
    }

    if (command.hotelIdsToAssign) {
      command.hotelIdsToAssign.forEach(hotelId => {
        admin.assignToHotel(hotelId);
      });
    }

    if (command.hotelIdsToUnassign) {
      command.hotelIdsToUnassign.forEach(hotelId => {
        admin.unassignFromHotel(hotelId);
      });
    }

    if (command.activate !== undefined) {
      if (command.activate) {
        admin.activate();
      } else {
        admin.deactivate();
      }
    }

    await this.adminRepository.save(admin);

    return admin;
  }
}
