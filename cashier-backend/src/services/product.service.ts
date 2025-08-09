import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";
import { ProductInput, ProductQuery } from "../models/interface";

type ProductCategory = 'FRUITS' | 'VEGETABLES' | 'CANNED_GOODS' | 'DAIRY' | 'MEAT' | 'SEAFOOD' | 'DELI' | 'CONDIMENTS_SPICES' | 'SNACKS' | 
    'BREAD_AND_BAKERY' | 'BEVERAGES' | 'PASTA_RICE_CEREAL' | 'BAKING' | 'FROZEN_FOODS' | 'PERSONAL_CARE' | 'HEALTH_CARE' | 'HOUSEHOLD' |
    'BABY_ITEMS' | 'PET_SUPPLIES' | 'AUTOMOTIVE' | 'ELECTRONICS' | 'SPORTS_OUTDOORS' | 'TOYS' | 'STATIONERIES' | 'CLOTHING'

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
        price: true,
        stock: true,
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
  
    if (typeof stock === "number") {
      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }
    }
  
    return await prisma.product.update({
      where: { id },
      data: {
        ...otherFields,
        ...(typeof stock === "number" ? { stock } : {}),
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
