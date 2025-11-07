import { IRepository } from '../../../core/IRepository';
import { Admin } from '../entities/Admin';
import { AdminRole } from '../value-objects/AdminRole';

export interface IAdminRepository extends IRepository<Admin> {
  findByCustomerId(customerId: string): Promise<Admin | null>;
  findByHotelId(hotelId: string): Promise<Admin[]>;
  findByRole(role: AdminRole): Promise<Admin[]>;
  findActiveAdmins(): Promise<Admin[]>;
  findSuperAdmins(): Promise<Admin[]>;
}
