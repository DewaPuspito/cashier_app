import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { AuthorizationMiddleware } from '../middlewares/authorization.middleware';

export class ReportRouter {
  public router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.routes();
  }

  private routes(): void {
    this.router.get('/daily-summary', AuthenticationMiddleware.verifyToken, 
    AuthorizationMiddleware.allowAdmin, this.reportController.getDailyReport.bind(this.reportController));
    this.router.get('/daily-item', AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, 
    this.reportController.getDailyItemReport.bind(this.reportController));
  }
}