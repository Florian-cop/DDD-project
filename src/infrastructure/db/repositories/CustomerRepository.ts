import { PrismaClient } from '@prisma/client';
import { ICustomerRepository, Customer, Email } from '../domain/customer/index';

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany();
    
    return customers.map((customer) =>
      Customer.create(
        customer.email,
        customer.firstname,
        customer.lastname,
        customer.phoneNumber,
        customer.id
      )
    );
  }

  async findOneById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id }
    });

    if (!customer) {
      return null;
    }

    return Customer.create(
      customer.email,
      customer.firstname,
      customer.lastname,
      customer.phoneNumber,
      customer.id
    );
  }

  async doesExists(id: string): Promise<boolean> {
    const count = await this.prisma.customer.count({
      where: { id }
    });

    return count > 0;
  }

  async save(entity: Customer): Promise<void> {
    await this.prisma.customer.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        email: entity.email.value,
        firstname: entity.firstname,
        lastname: entity.lastname,
        phoneNumber: entity.phoneNumber.value
      },
      update: {
        email: entity.email.value,
        firstname: entity.firstname,
        lastname: entity.lastname,
        phoneNumber: entity.phoneNumber.value
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id }
    });
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { email: email.value }
    });

    if (!customer) {
      return null;
    }

    return Customer.create(
      customer.email,
      customer.firstname,
      customer.lastname,
      customer.phoneNumber,
      customer.id
    );
  }
}
