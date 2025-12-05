import { Request, Response } from 'express';
import { GetWalletService } from '../../../../application/wallet/GetWalletService';
import { GetWalletQuery } from '../../../../application/wallet/GetWalletQuery';
import { Wallet } from '../../../../domain/wallet/entities/Wallet';

interface WalletResponseDTO {
  id: string;
  balance: number;
  customerId: string;
}

export class GetWalletController {
  constructor(private readonly getWalletService: GetWalletService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
      }

      const query = new GetWalletQuery(customerId);

      const wallet = await this.getWalletService.execute(query);

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
