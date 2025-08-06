import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthenticationMiddleware } from "../middlewares/authentication.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { productSchema } from "../lib/validation/product.validation";
import { upload } from "../middlewares/imageUpload.middleware";

export class ProductRouter {
  public router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.routes();
  }

  private routes(): void {
    this.router.get("/products", AuthenticationMiddleware.verifyToken, this.productController.findAll.bind(this.productController));
    this.router.get("/products/:id", AuthenticationMiddleware.verifyToken, this.productController.findById.bind(this.productController));
    this.router.post("/products", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, upload.single('imageUrl'), 
    ValidationMiddleware.validate({body: productSchema.body}), this.productController.create.bind(this.productController));
    this.router.put("/products/:id", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, upload.single('imageUrl'), 
    ValidationMiddleware.validate({body: productSchema.body, params: productSchema.params, partial: true}),
    this.productController.update.bind(this.productController));
    this.router.delete("/products/:id", AuthenticationMiddleware.verifyToken, AuthorizationMiddleware.allowAdmin, 
    this.productController.delete.bind(this.productController));
  }
}
