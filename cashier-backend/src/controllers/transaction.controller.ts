import { Response } from 'express';
import { RequestCollection } from '../types/express';
import { TransactionService } from '../services/transaction.service';
import { TransactionInput } from '../models/interface';

export class TransactionController {
  private transactionService = new TransactionService();

  async create(req: RequestCollection, res: Response) {
    try {
      const { items, paymentType, cashReceived, cardNumber } = req.body;
      const cashierId = req.cashier!.id;
      const { shiftId } = req.params;

      const input: TransactionInput = {
        cashierId,
        shiftId,
        items,
        paymentType,
        cashReceived,
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

  async getDailyHistory(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.cashier!.id;
      const history = await this.transactionService.getDailyTransactions(cashierId);
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

  async getTransactionById(req: RequestCollection, res: Response) {
    try {
      const { transactionId } = req.params;
      const transaction = await this.transactionService.getTransactionDetailPerShift(transactionId);
      
      res.status(200).json({
        message: 'Transaction found',
        data: transaction
      });
    } catch (error: any) {
      res.status(error.message === 'Transaction not found' ? 404 : 500).json({
        message: error.message || 'Failed to fetch transaction'
      });
    }
  }
}
