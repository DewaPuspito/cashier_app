import { Router } from 'express';
import { cashierAuthController } from '../controllers/cashier.auth.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { loginSchema } from '../lib/validation/cashier.auth.validation';

export class cashierAuthRouter {
  public router: Router;
  private authController: cashierAuthController;

  constructor() {
    this.router = Router();
    this.authController = new cashierAuthController();
    this.routes();
  }

  private routes(): void {
    this.router.post('/cashier/auth/login', ValidationMiddleware.validate({ body: loginSchema }), this.authController.login.bind(this.authController));
  }
}