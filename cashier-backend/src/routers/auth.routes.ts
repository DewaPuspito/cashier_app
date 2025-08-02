import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { loginSchema } from '../lib/validation/auth.validation';

export class adminAuthRouter {
  public router: Router;
  private authController: authController;

  constructor() {
    this.router = Router();
    this.authController = new authController();
    this.routes();
  }

  private routes(): void {
    this.router.post('/auth/login', ValidationMiddleware.validate({ body: loginSchema }), this.authController.login.bind(this.authController));
  }
}