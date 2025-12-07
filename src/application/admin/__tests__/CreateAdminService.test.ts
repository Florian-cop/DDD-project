import { CreateAdminService } from '../CreateAdminService';
import { CreateAdminCommand } from '../CreateAdminCommand';
import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { AdminRole } from '@domain/admin/value-objects/AdminRole';
import { Email } from '@domain/customer/value-objects/Email';

describe('CreateAdminService', () => {
  let adminRepository: jest.Mocked<IAdminRepository>;
  let createAdminService: CreateAdminService;

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

    createAdminService = new CreateAdminService(adminRepository);
  });

  describe('execute', () => {
    it('should create an admin successfully', async () => {
      const command = new CreateAdminCommand(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678',
        AdminRole.ADMIN
      );

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.save.mockResolvedValue();

      const result = await createAdminService.execute(command);

      expect(result).toBeInstanceOf(Admin);
      expect(result.email.value).toBe('admin@test.com');
      expect(result.name.firstname).toBe('John');
      expect(result.name.lastname).toBe('Doe');
      expect(result.phoneNumber.value).toBe('0612345678');
      expect(result.role.value).toBe(AdminRole.ADMIN);
      expect(result.isActive).toBe(true);
      expect(adminRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw error if admin email already exists', async () => {
      const command = new CreateAdminCommand(
        'existing@test.com',
        'John',
        'Doe',
        '0612345678'
      );

      const existingAdmin = Admin.create(
        'existing@test.com',
        'Jane',
        'Smith',
        '0698765432'
      );

      adminRepository.findByEmail.mockResolvedValue(existingAdmin);

      await expect(createAdminService.execute(command)).rejects.toThrow(
        'Admin with email "existing@test.com" already exists'
      );
      expect(adminRepository.save).not.toHaveBeenCalled();
    });

    it('should create admin with default role when role is not provided', async () => {
      const command = new CreateAdminCommand(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678'
      );

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.save.mockResolvedValue();

      const result = await createAdminService.execute(command);

      expect(result.role.value).toBe(AdminRole.ADMIN);
    });

    it('should throw error for invalid email format during execution', async () => {
      const command = new CreateAdminCommand(
        'invalid-email',
        'John',
        'Doe',
        '0612345678'
      );

      adminRepository.findByEmail.mockRejectedValue(new Error('Invalid email format'));

      await expect(createAdminService.execute(command)).rejects.toThrow();
    });

    it('should throw error when firstname is empty', async () => {
      expect(() => {
        new CreateAdminCommand(
          'admin@test.com',
          '',
          'Doe',
          '0612345678'
        );
      }).toThrow('Firstname is required');
    });

    it('should throw error when lastname is empty', async () => {
      expect(() => {
        new CreateAdminCommand(
          'admin@test.com',
          'John',
          '',
          '0612345678'
        );
      }).toThrow('Lastname is required');
    });

    it('should throw error when phone number is empty', async () => {
      expect(() => {
        new CreateAdminCommand(
          'admin@test.com',
          'John',
          'Doe',
          ''
        );
      }).toThrow('Phone number is required');
    });

    it('should validate email format through Email value object', async () => {
      const command = new CreateAdminCommand(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678'
      );

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.save.mockResolvedValue();

      const result = await createAdminService.execute(command);

      expect(() => Email.create('admin@test.com')).not.toThrow();
      expect(result.email.value).toBe('admin@test.com');
    });

    it('should validate phone number format', async () => {
      const command = new CreateAdminCommand(
        'admin@test.com',
        'John',
        'Doe',
        '0612345678'
      );

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.save.mockResolvedValue();

      const result = await createAdminService.execute(command);

      expect(result.phoneNumber.value).toBe('0612345678');
    });
  });
});
