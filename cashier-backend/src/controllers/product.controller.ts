import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductInput, ProductQuery } from "../models/interface";

type ProductCategory = 'FOOD' | 'DRINK' | 'CLOTHING' | 'ELECTRONICS' | 'HEALTH' | 'STATIONERY'

export class ProductController {
  private productService = new ProductService();

  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const query: ProductQuery = {
        search: req.query.search as string,
        price: req.query.price? parseInt(req.query.price as string) : undefined,
        stock: req.query.stock? parseInt(req.query.stock as string) : undefined,
        category: req.query.category as ProductCategory,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 15,
      };
      const result = await this.productService.findAllProduct(query);
      res.status(200).json({
        message: "Products displayed successfully",
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        message: "Failed to display products",
        detail: error,
      });
    }
  }

  public async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const product = await this.productService.findProductDetail(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json({ message: "Product found", data: product });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const input: ProductInput = req.body;
    const data = await this.productService.createProduct(input);
    res.status(201).json({ message: "Product created", data });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const input: ProductQuery = req.body;
  
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
