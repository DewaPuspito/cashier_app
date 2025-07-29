import { Router } from "express";
import { CashierController } from "../controllers/cashier.controller";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { shiftSchema } from "../lib/validation/shift.validation";

export class CashierRouter {
  public router: Router;
  private cashierController: CashierController;

  constructor() {
    this.router = Router();
    this.cashierController = new CashierController();
    this.routes();
  }

  private routes(): void {
    this.router.post("/shift/start", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles("CASHIER"),
    ValidationMiddleware.validate({ body: shiftSchema.body }), this.cashierController.startShift.bind(this.cashierController));

    this.router.patch("/shift/end/:id", AuthenticationMiddleware.verifyToken, AuthenticationMiddleware.checkCashierOwnership,
    AuthorizationMiddleware.allowRoles("CASHIER"), ValidationMiddleware.validate({body: shiftSchema.body.partial(), params: shiftSchema.params}),
    this.cashierController.endShift.bind(this.cashierController));

    this.router.get("/shift/:id", AuthenticationMiddleware.verifyToken, AuthenticationMiddleware.checkCashierOwnership,
    AuthorizationMiddleware.allowRoles("CASHIER"),this.cashierController.myShifts.bind(this.cashierController)
    );
  }
}
