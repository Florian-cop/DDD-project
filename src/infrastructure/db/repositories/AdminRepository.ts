import { PrismaClient } from '@prisma/client';
import { IAdminRepository } from '@domain/admin/repositories/IAdminRepository';
import { Admin } from '@domain/admin/entities/Admin';
import { Email } from '@domain/customer/value-objects/Email';
import { PersonName } from '@domain/customer/value-objects/PersonName';
import { PhoneNumber } from '@domain/customer/value-objects/PhoneNumber';
import { AdminRoleVO, AdminRole } from '@domain/admin/value-objects/AdminRole';

type PrismaAdmin = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  hiredDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class AdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Admin[]> {
    const admins = await this.prisma.admin.findMany();
    return admins.map((admin: PrismaAdmin) => this.toDomain(admin));
  }

  async findOneById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { id }
    });

    if (!admin) {
      return null;
    }

    return this.toDomain(admin);
  }

  async findByEmail(email: Email): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: email.value }
    });

    if (!admin) {
      return null;
    }

    return this.toDomain(admin);
  }

  async findActiveAdmins(): Promise<Admin[]> {
    const admins = await this.prisma.admin.findMany({
      where: { isActive: true }
    });
    
    return admins.map((admin: PrismaAdmin) => this.toDomain(admin));
  }

  async doesExists(id: string): Promise<boolean> {
    const count = await this.prisma.admin.count({
      where: { id }
    });

    return count > 0;
  }

  async save(entity: Admin): Promise<void> {
    await this.prisma.admin.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        email: entity.email.value,
        firstname: entity.name.firstname,
        lastname: entity.name.lastname,
        phoneNumber: entity.phoneNumber.value,
        role: entity.role.role,
        isActive: entity.isActive,
        hiredDate: entity.hiredDate
      },
      update: {
        email: entity.email.value,
        firstname: entity.name.firstname,
        lastname: entity.name.lastname,
        phoneNumber: entity.phoneNumber.value,
        role: entity.role.role,
        isActive: entity.isActive
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({
      where: { id }
    });
  }

  private toDomain(prismaAdmin: PrismaAdmin): Admin {
    const emailVO = Email.create(prismaAdmin.email);
    const nameVO = PersonName.create(prismaAdmin.firstname, prismaAdmin.lastname);
    const phoneNumberVO = PhoneNumber.create(prismaAdmin.phoneNumber);
    const roleVO = AdminRoleVO.create(prismaAdmin.role as AdminRole);

    return Admin.fromValueObjects(
      {
        email: emailVO,
        name: nameVO,
        phoneNumber: phoneNumberVO,
        role: roleVO,
        isActive: prismaAdmin.isActive,
        hiredDate: prismaAdmin.hiredDate
      },
      prismaAdmin.id
    );
  }
}
