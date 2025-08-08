import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { shiftSchema } from "../lib/validation/shift.validation";

export class ShiftRouter {
  public router: Router;
  private ShiftController: ShiftController;

  constructor() {
    this.router = Router();
    this.ShiftController = new ShiftController();
    this.routes();
  }

  private routes(): void {
    this.router.post("/shift/start", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowCashier, 
    ValidationMiddleware.validate({ body: shiftSchema.body }), this.ShiftController.startShift.bind(this.ShiftController));

    this.router.patch("/shift/:id/end", AuthenticationMiddleware.verifyToken, AuthenticationMiddleware.checkCashierOwnership,
    AuthorizationMiddleware.allowCashier, ValidationMiddleware.validate({body: shiftSchema.body.partial(), params: shiftSchema.params}),
    this.ShiftController.endShift.bind(this.ShiftController));

    this.router.get("/shift/active", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowCashier, 
    this.ShiftController.getActiveShift.bind(this.ShiftController));
  }
}
