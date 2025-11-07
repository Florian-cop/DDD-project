import { Request, Response } from 'express';
import { UpdateCustomerService } from '../../../../application/customer/update/UpdateCustomerService';
import { UpdateCustomerCommand } from '../../../../application/customer/update/UpdateCustomerCommand';
import { Customer } from '../../../../domain/customer';
import { UpdateCustomerDTO, CustomerResponseDTO } from '../../dtos/CustomerDTO';

export class UpdateCustomerController {
  constructor(private readonly updateCustomerService: UpdateCustomerService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateCustomerDTO = req.body;

      if (!id) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const command = new UpdateCustomerCommand(
        id,
        dto.email,
        dto.firstname,
        dto.lastname,
        dto.phoneNumber
      );

      const customer = await this.updateCustomerService.execute(command);

      const response = this.toDTO(customer);

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  private toDTO(customer: Customer): CustomerResponseDTO {
    return {
      id: customer.id,
      email: customer.email.value,
      firstname: customer.firstname,
      lastname: customer.lastname,
      fullname: customer.fullname,
      phoneNumber: customer.phoneNumber.value
    };
  }
}
