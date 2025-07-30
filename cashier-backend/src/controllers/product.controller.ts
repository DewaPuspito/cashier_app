import { prisma } from "../prisma/client";
import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductInput, ProductQuery } from "../models/interface";
import { Category } from "@prisma/client";
import { CloudinaryService } from "../lib/cloudinary.config";

export class ProductController {
  private productService = new ProductService();
  private cloudinaryService = new CloudinaryService();

  constructor() {
    this.productService = new ProductService();
    this.cloudinaryService = new CloudinaryService();
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const query: ProductQuery = {
        search: req.query.search as string,
        price: req.query.price? parseInt(req.query.price as string) : undefined,
        stock: req.query.stock? parseInt(req.query.stock as string) : undefined,
        category: req.query.category as Category,
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
    try {
      if (!req.file) {
        res.status(400).json({
          message: "Image file is required",
        });
        return
      }

      const imageURL = await this.cloudinaryService.uploadFileForProduct(req.file as Express.Multer.File);
      const data: ProductInput = {
        name: req.body.name,
        price: parseInt(req.body.price),
        stock: parseInt(req.body.stock),
        category: req.body.category as Category,
        imageUrl: imageURL
      };
      
      const result = await this.productService.createProduct(data);
      res.status(201).json({ message: "Product created", data: result });
    } catch (error: any) {
      console.error('Error in create product:', error);
      res.status(error.status || 400).json({
        message: error.message || "Product not created successfully",
        detail: error,
      });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      let imageUrl;

      if (req.file) {
        imageUrl = await this.cloudinaryService.uploadFileForProduct(req.file as Express.Multer.File);
      }

      const data: Partial<ProductInput> = {
        ...req.body,
        ...(imageUrl && { imageURL: imageUrl })
      };

      const result = await this.productService.updateProduct(id, data);
      res.status(200).json({
        message: "Product updated successfully",
        data: result,
      });
    } catch (error: any) {
      console.error('Error in update event:', error);
      res.status(error.status || 400).json({
        message: error.message || "Failed to update product",
        detail: error,
      });
    }
  }  

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
  
    if (!product) {
      throw new Error("Product not found");
    }
  
    if (product.imageUrl) {
      try {
        const publicId = product.imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      } catch (err) {
        console.error("Failed to delete image from Cloudinary", err);
      }
    }
  
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }  
}
