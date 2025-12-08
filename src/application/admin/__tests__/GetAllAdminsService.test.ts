import { GetAllAdminsService } from '../GetAllAdminsService';
import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { AdminRole } from '@domain/admin/value-objects/AdminRole';

describe('GetAllAdminsService', () => {
  let adminRepository: jest.Mocked<IAdminRepository>;
  let getAllAdminsService: GetAllAdminsService;

  beforeEach(() => {
    adminRepository = {
      findByEmail: jest.fn(),
      findActiveAdmins: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      doesExists: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IAdminRepository>;

    getAllAdminsService = new GetAllAdminsService(adminRepository);
  });

  describe('execute', () => {
    it('should return all admins', async () => {
      const admin1 = Admin.create(
        'admin1@test.com',
        'John',
        'Doe',
        '0612345678',
        AdminRole.ADMIN,
        'admin-1'
      );

      const admin2 = Admin.create(
        'admin2@test.com',
        'Jane',
        'Smith',
        '0698765432',
        AdminRole.ADMIN,
        'admin-2'
      );

      const admins = [admin1, admin2];
      adminRepository.findAll.mockResolvedValue(admins);

      const result = await getAllAdminsService.execute();

      expect(result).toEqual(admins);
      expect(result.length).toBe(2);
      expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no admins exist', async () => {
      adminRepository.findAll.mockResolvedValue([]);

      const result = await getAllAdminsService.execute();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return admins with correct properties', async () => {
      const admin = Admin.create(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678',
        AdminRole.ADMIN,
        'admin-1'
      );

      adminRepository.findAll.mockResolvedValue([admin]);

      const result = await getAllAdminsService.execute();

      expect(result[0].id).toBe('admin-1');
      expect(result[0].email.value).toBe('admin@test.com');
      expect(result[0].name.firstname).toBe('John');
      expect(result[0].name.lastname).toBe('Doe');
      expect(result[0].name.fullname).toBe('John Doe');
      expect(result[0].phoneNumber.value).toBe('0612345678');
      expect(result[0].role.value).toBe(AdminRole.ADMIN);
      expect(result[0].isActive).toBe(true);
      expect(result[0].hiredDate).toBeInstanceOf(Date);
    });

    it('should return both active and inactive admins', async () => {
      const activeAdmin = Admin.create(
        'active@test.com',
        'Active',
        'Admin',
        '0612345678',
        AdminRole.ADMIN,
        'admin-1'
      );

      const inactiveAdmin = Admin.create(
        'inactive@test.com',
        'Inactive',
        'Admin',
        '0698765432',
        AdminRole.ADMIN,
        'admin-2'
      );
      inactiveAdmin.deactivate();

      const admins = [activeAdmin, inactiveAdmin];
      adminRepository.findAll.mockResolvedValue(admins);

      const result = await getAllAdminsService.execute();

      expect(result.length).toBe(2);
      expect(result[0].isActive).toBe(true);
      expect(result[1].isActive).toBe(false);
    });

    it('should handle repository errors gracefully', async () => {
      const error = new Error('Database connection failed');
      adminRepository.findAll.mockRejectedValue(error);

      await expect(getAllAdminsService.execute()).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should return admins ordered as provided by repository', async () => {
      const admin1 = Admin.create(
        'admin1@test.com',
        'Alice',
        'Anderson',
        '0612345678',
        AdminRole.ADMIN,
        'admin-1'
      );

      const admin2 = Admin.create(
        'admin2@test.com',
        'Bob',
        'Brown',
        '0698765432',
        AdminRole.ADMIN,
        'admin-2'
      );

      const admin3 = Admin.create(
        'admin3@test.com',
        'Charlie',
        'Clark',
        '0611223344',
        AdminRole.ADMIN,
        'admin-3'
      );

      const admins = [admin1, admin2, admin3];
      adminRepository.findAll.mockResolvedValue(admins);

      const result = await getAllAdminsService.execute();

      expect(result[0].name.firstname).toBe('Alice');
      expect(result[1].name.firstname).toBe('Bob');
      expect(result[2].name.firstname).toBe('Charlie');
    });
  });
});
