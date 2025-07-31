import { Router } from 'express';
import { CashierController } from '../controllers/cashier.controller';

export class CashierRouter {
  public router: Router;
  private cashierController: CashierController;

  constructor() {
    this.router = Router();
    this.cashierController = new CashierController();
    this.routes();
  }

  private routes(): void {
    this.router.get('/cashier', this.cashierController.getAll.bind(this.cashierController));
    this.router.get('/cashier/:id', this.cashierController.getById.bind(this.cashierController));
    this.router.post('/cashier', this.cashierController.create.bind(this.cashierController));
    this.router.put('/cashier/:id', this.cashierController.update.bind(this.cashierController));
    this.router.delete('/cashier/:id', this.cashierController.delete.bind(this.cashierController));
  }
}