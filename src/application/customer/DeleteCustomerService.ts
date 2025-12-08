import { ICustomerRepository } from '@domain/customer';
import { DeleteCustomerCommand } from './DeleteCustomerCommand';

export class DeleteCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const exists = await this.customerRepository.doesExists(command.id);
    
    if (!exists) {
      throw new Error(`Customer with id "${command.id}" not found`);
    }

    await this.customerRepository.delete(command.id);
  }
}
