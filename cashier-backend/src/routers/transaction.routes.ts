import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '../middlewares/authorization.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { transactionSchema } from '../lib/validation/transaction.validation';

export class TransactionRouter {
  public router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.routes();
  }

  private routes(): void {
    this.router.post('/transactions',AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles('CASHIER'),
    ValidationMiddleware.validate({ body: transactionSchema.body }), this.transactionController.create.bind(this.transactionController));

    this.router.get('/transactions/history', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles('CASHIER'),
    this.transactionController.getDailyHistory.bind(this.transactionController));
  }
}
