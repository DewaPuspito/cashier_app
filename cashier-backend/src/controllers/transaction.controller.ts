import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { TransactionInput } from '../models/interface';

export class TransactionController {
  private transactionService = new TransactionService();

  async create(req: Request, res: Response) {
    try {
      const { items, paymentType, cashAmount, cardNumber } = req.body;
      const { userId, shiftId } = (req as any).user;

      const input: TransactionInput = {
        userId,
        shiftId,
        items,
        paymentType,
        cashAmount,
        cardNumber,
      };

      const transaction = await this.transactionService.createTransaction(input);

      res.status(201).json({
        message: 'Transaction successful',
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Failed to create transaction',
      });
    }
  }

  async getDailyHistory(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const history = await this.transactionService.getDailyTransactions(userId);
      res.status(200).json({
        message: 'Transaction history',
        data: history,
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to fetch transactions',
      });
    }
  }
}
