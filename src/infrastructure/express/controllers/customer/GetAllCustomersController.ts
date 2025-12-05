import { Request, Response } from 'express';
import { GetAllCustomersService } from '../../../../application/customer/GetAllCustomersService';
import { Customer } from '@domain/customer';
import { CustomerResponseDTO } from '../../dtos/CustomerDTO';

export class GetAllCustomersController {
  constructor(private readonly getAllCustomersService: GetAllCustomersService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const customers = await this.getAllCustomersService.execute();

      const response = customers.map((customer) => this.toDTO(customer));

      res.status(200).json(response);
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
