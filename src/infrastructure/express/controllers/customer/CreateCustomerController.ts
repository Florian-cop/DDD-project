import { Request, Response } from 'express';
import { CreateCustomerService } from '../../../../application/customer/create/CreateCustomerService';
import { CreateCustomerCommand } from '../../../../application/customer/create/CreateCustomerCommand';
import { Customer } from '../domain/customer/index';
import { CreateCustomerDTO, CustomerResponseDTO } from '../../dtos/CustomerDTO';

export class CreateCustomerController {
  constructor(private readonly createCustomerService: CreateCustomerService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateCustomerDTO = req.body;

      if (!dto.email || !dto.firstname || !dto.lastname || !dto.phoneNumber) {
        res.status(400).json({
          error: 'Missing required fields: email, firstname, lastname, phoneNumber'
        });
        return;
      }

      const command = new CreateCustomerCommand(
        dto.email,
        dto.firstname,
        dto.lastname,
        dto.phoneNumber
      );

      const customer = await this.createCustomerService.execute(command);

      const response = this.toDTO(customer);

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
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
