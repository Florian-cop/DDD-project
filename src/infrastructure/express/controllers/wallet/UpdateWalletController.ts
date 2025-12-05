import { Request, Response } from 'express';
import { UpdateWalletService } from '../../../../application/wallet/UpdateWalletService';
import { UpdateWalletCommand } from '../../../../application/wallet/UpdateWalletCommand';
import { Wallet } from '../../../../domain/wallet/entities/Wallet';

interface WalletResponseDTO {
  id: string;
  balance: number;
  customerId: string;
}

export class UpdateWalletController {
  constructor(private readonly updateWalletService: UpdateWalletService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const { balance } = req.body;

      if (!customerId) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      if (balance === undefined || balance === null) {
        res.status(400).json({ error: 'Balance is required' });
        return;
      }

      if (typeof balance !== 'number') {
        res.status(400).json({ error: 'Balance must be a number' });
        return;
      }

      const command = new UpdateWalletCommand(customerId, balance);

      const wallet = await this.updateWalletService.execute(command);

      const response = this.toDTO(wallet);

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

  private toDTO(wallet: Wallet): WalletResponseDTO {
    return {
      id: wallet.id,
      balance: wallet.balance,
      customerId: wallet.idCustomer
    };
  }
}
