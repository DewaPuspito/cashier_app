import { Router } from 'express';
import { adminAuthController } from '../controllers/admin.auth.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../lib/validation/admin.auth.validation';

export class adminAuthRouter {
  public router: Router;
  private authController: adminAuthController;

  constructor() {
    this.router = Router();
    this.authController = new adminAuthController();
    this.routes();
  }

  private routes(): void {
    this.router.post('/admin/auth/login', ValidationMiddleware.validate({ body: loginSchema }), this.authController.login.bind(this.authController));
    this.router.post('/admin/auth/register', ValidationMiddleware.validate({ body: registerSchema }), this.authController.register.bind(this.authController));
  }
}