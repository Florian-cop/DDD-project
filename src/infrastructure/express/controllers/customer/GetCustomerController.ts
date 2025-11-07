import { Request, Response } from 'express';
import { GetCustomerService } from '../../../../application/customer/get/GetCustomerService';
import { GetCustomerQuery } from '../../../../application/customer/get/GetCustomerQuery';
import { Customer } from '../../../../domain/customer/Customer';
import { CustomerResponseDTO } from '../../dtos/CustomerDTO';

export class GetCustomerController {
  constructor(private readonly getCustomerService: GetCustomerService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const query = new GetCustomerQuery(id);

      const customer = await this.getCustomerService.execute(query);

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
