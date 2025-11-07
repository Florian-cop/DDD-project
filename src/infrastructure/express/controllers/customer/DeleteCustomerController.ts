import { Request, Response } from 'express';
import { DeleteCustomerService } from '../../../../application/customer/delete/DeleteCustomerService';
import { DeleteCustomerCommand } from '../../../../application/customer/delete/DeleteCustomerCommand';

export class DeleteCustomerController {
  constructor(private readonly deleteCustomerService: DeleteCustomerService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const command = new DeleteCustomerCommand(id);

      await this.deleteCustomerService.execute(command);

      res.status(204).send();
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
}
