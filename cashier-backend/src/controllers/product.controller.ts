import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductInput, ProductUpdateInput } from "../models/interface";

export class ProductController {
  private productService = new ProductService();

  public async findAll(_req: Request, res: Response): Promise<void> {
    const data = await this.productService.findAllProduct();
    res.status(200).json({ message: "Products fetched", data });
  }

  public async findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const product = await this.productService.findProductDetail(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product found", data: product });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const input: ProductInput = req.body;
    const data = await this.productService.createProduct(input);
    res.status(201).json({ message: "Product created", data });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const input: ProductUpdateInput = req.body;
  
    if (input.stock && typeof input.stock === "number") {
      const current = await this.productService.findProductDetail(id);
      if (!current) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      if ((current.stock ?? 0) + input.stock < 0) {
        res.status(400).json({ message: "Insufficient stock for this update" });
        return;
      }
    }
  
    const data = await this.productService.updateProduct(id, input);
    res.status(200).json({ message: "Product updated", data });
  }  

  public async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await this.productService.softDeleteProduct(id);
    res.status(200).json({ message: "Product deleted" });
  }
}
