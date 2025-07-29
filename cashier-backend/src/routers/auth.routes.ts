import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../lib/validation/auth.validation';

export class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  private routes(): void {
    this.router.post('/auth/login', ValidationMiddleware.validate({ body: loginSchema }), this.authController.login.bind(this.authController));
    this.router.post('/auth/register', ValidationMiddleware.validate({ body: registerSchema }), this.authController.register.bind(this.authController));
  }
}