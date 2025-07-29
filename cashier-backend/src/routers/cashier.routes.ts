import { Router } from "express";
import { CashierController } from "../controllers/cashier.controller";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";

export class CashierRouter {
  public router: Router;
  private cashierController: CashierController;

  constructor() {
    this.router = Router();
    this.cashierController = new CashierController();
    this.routes();
  }

  private routes(): void {
    this.router.use( AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles("CASHIER"));

    this.router.post("/shift/start", this.cashierController.startShift.bind(this.cashierController));
    this.router.post("/shift/end", this.cashierController.endShift.bind(this.cashierController));
    this.router.get("/shift/me", this.cashierController.myShifts.bind(this.cashierController));
  }
}
