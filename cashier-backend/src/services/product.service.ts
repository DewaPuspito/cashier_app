import { prisma } from "../prisma/client";
import { ProductInput, ProductUpdateInput } from "../models/interface";

export class ProductService {
  async findAllProduct() {
    return await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        price: true,
        stock: true,
      },
    });
  }
  

  async findProductDetail(id: string) {
    return await prisma.product.findUnique({ 
      where: { id },
      select: {
        name: true,
        price: true,
        stock: true,
      },
    })
  }

  async createProduct(data: ProductInput) {
    return await prisma.product.create({ data });
  }

  async updateProduct(id: string, data: ProductUpdateInput) {
    const { stock, ...otherFields } = data;
  
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
      data: { deletedAt: new Date() },
    });
  }
}
