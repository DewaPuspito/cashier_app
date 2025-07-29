import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";

export class ProductRouter {
  public router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes(): void {
    this.router.get("/products", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles(['CASHIER', 'ADMIN']), 
    this.productController.findAll.bind(this.productController));
    this.router.get("/products/:id", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles(['CASHIER', 'ADMIN']), 
    this.productController.findById.bind(this.productController));
    this.router.post("/products", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles('ADMIN'), 
    this.productController.create.bind(this.productController));
    this.router.put("/products/:id", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles('ADMIN'), 
    this.productController.update.bind(this.productController));
    this.router.delete("/products/:id", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowRoles('ADMIN'), 
    this.productController.delete.bind(this.productController));
  }
}
