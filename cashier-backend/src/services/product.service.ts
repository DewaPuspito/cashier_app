import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";
import { ProductInput, ProductQuery } from "../models/interface";

type ProductCategory = 'FOOD' | 'DRINK' | 'CLOTHING' | 'ELECTRONICS' | 'HEALTH' | 'STATIONERY'

export class ProductService {
  async findAllProduct(query: ProductQuery) {
    const {search, price, stock, category, page = 1, limit = 20} = query

    const where : Prisma.ProductWhereInput = {
      isDeleted: false
    }

    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    if (price) {
      where.price = price
    }

    if (stock) {
        where.stock = stock;
    }

    if (category) {
        where.category = {
          equals: category as ProductCategory
        };
    }

    return prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit
    }) 
  }

  async findProductDetail(id: string) {
    return await prisma.product.findUnique({ 
      where: { id, isDeleted: false  },
      select: {
        name: true,
        category: true,
        imageUrl: true,
      },
    })
  }

  async createProduct(data: ProductInput) {
    return await prisma.product.create({ data });
  }

  async updateProduct(id: string, data: ProductQuery) {
    const { stock, ...otherFields } = data;
  
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.isDeleted) throw new Error("Product not found");
  
    if (typeof stock === "number" && stock !== 0) {
      const finalStock = product.stock + stock;
  
      if (finalStock < 0) {
        throw new Error("Stock cannot be negative");
      }
    }
  
    return await prisma.product.update({
      where: { id },
      data: {
        ...otherFields,
        ...(typeof stock === "number" && stock !== 0
          ? {
              stock: {
                increment: stock,
              },
            }
          : {}),
      },
    });
  }

  async softDeleteProduct(id: string) {
    return await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
