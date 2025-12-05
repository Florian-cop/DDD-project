import { Request, Response } from 'express';
import { DeleteWalletService } from '../../../../application/wallet/DeleteWalletService';
import { DeleteWalletCommand } from '../../../../application/wallet/DeleteWalletCommand';

export class DeleteWalletController {
  constructor(private readonly deleteWalletService: DeleteWalletService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const command = new DeleteWalletCommand(customerId);

      await this.deleteWalletService.execute(command);

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
