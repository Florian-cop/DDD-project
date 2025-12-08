import { GetAdminService } from '../GetAdminService';
import { GetAdminQuery } from '../GetAdminQuery';
import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { AdminRole } from '@domain/admin/value-objects/AdminRole';

describe('GetAdminService', () => {
  let adminRepository: jest.Mocked<IAdminRepository>;
  let getAdminService: GetAdminService;

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

    getAdminService = new GetAdminService(adminRepository);
  });

  describe('execute', () => {
    it('should get an admin by id successfully', async () => {
      const adminId = 'admin-123';
      const admin = Admin.create(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678',
        AdminRole.ADMIN,
        adminId
      );

      const query = new GetAdminQuery(adminId);
      adminRepository.findOneById.mockResolvedValue(admin);

      const result = await getAdminService.execute(query);

      expect(result).toBe(admin);
      expect(result?.id).toBe(adminId);
      expect(result?.email.value).toBe('admin@test.com');
      expect(adminRepository.findOneById).toHaveBeenCalledWith(adminId);
    });

    it('should throw error when admin is not found', async () => {
      const adminId = 'non-existent-id';
      const query = new GetAdminQuery(adminId);

      adminRepository.findOneById.mockResolvedValue(null);

      await expect(getAdminService.execute(query)).rejects.toThrow(
        `Admin with id "${adminId}" not found`
      );
    });

    it('should throw error when admin id is empty', () => {
      expect(() => {
        new GetAdminQuery('');
      }).toThrow('Admin ID is required');
    });

    it('should throw error when admin id is whitespace', () => {
      expect(() => {
        new GetAdminQuery('   ');
      }).toThrow('Admin ID is required');
    });

    it('should return admin with all properties correctly', async () => {
      const adminId = 'admin-123';
      const admin = Admin.create(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678',
        AdminRole.ADMIN,
        adminId
      );

      const query = new GetAdminQuery(adminId);
      adminRepository.findOneById.mockResolvedValue(admin);

      const result = await getAdminService.execute(query);

      expect(result?.name.firstname).toBe('John');
      expect(result?.name.lastname).toBe('Doe');
      expect(result?.name.fullname).toBe('John Doe');
      expect(result?.phoneNumber.value).toBe('0612345678');
      expect(result?.role.value).toBe(AdminRole.ADMIN);
      expect(result?.isActive).toBe(true);
      expect(result?.hiredDate).toBeInstanceOf(Date);
    });
  });
});
