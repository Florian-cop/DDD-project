import { IRepository } from '@core/IRepository';
import { Admin } from '../entities/Admin';
import { Email } from '@domain/customer/value-objects/Email';

export interface IAdminRepository extends IRepository<Admin> {
  findByEmail(email: Email): Promise<Admin | null>;
  findActiveAdmins(): Promise<Admin[]>;
}
