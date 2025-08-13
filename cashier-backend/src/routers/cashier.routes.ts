import { Router } from 'express';
import { CashierController } from '../controllers/cashier.controller';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '../middlewares/authorization.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { CreateCashierSchema, UpdateCashierSchema } from '../lib/validation/cashier.validation';

export class CashierRouter {
  public router: Router;
  private cashierController: CashierController;

  constructor() {
    this.router = Router();
    this.cashierController = new CashierController();
    this.routes();
  }

  private routes(): void {
    this.router.get('/cashier', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, 
    this.cashierController.getAll.bind(this.cashierController));
    this.router.get('/cashier/:id', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin,
    this.cashierController.getById.bind(this.cashierController));
    this.router.post('/cashier', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin,
    ValidationMiddleware.validate({body: CreateCashierSchema.body}), this.cashierController.create.bind(this.cashierController));
    this.router.put('/cashier/:id', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin,
    ValidationMiddleware.validate({body: UpdateCashierSchema.body}), this.cashierController.update.bind(this.cashierController));
    this.router.delete('/cashier/:id', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, 
    this.cashierController.delete.bind(this.cashierController));
  }
}