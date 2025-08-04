import { prisma } from '../prisma/client';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';

export class CashierService {
  async getAll(page = 1, limit = 20, search?: string) {
    const where: Prisma.CashierWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            email: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          }
        ]
      })
    };

    const [total, cashiers] = await Promise.all([
      prisma.cashier.count({ where }),
      prisma.cashier.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: cashiers,
      totalPages,
      currentPage: page,
      totalItems: total
    };
  }

  async getById(id: string) {
    const cashier = await prisma.cashier.findUnique({ where: { id } });
    if (!cashier || cashier.isDeleted) throw new Error('Cashier not found');
    return cashier;
  }

  async createCashier(data: { name: string; email: string; password: string }) {
    const hashedPassword = await hash(data.password, 10);
    return prisma.cashier.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async updateCashier(id: string, data: { name?: string; email?: string; password?: string }) {
    const cashier = await prisma.cashier.findUnique({ where: { id } });
    if (!cashier || cashier.isDeleted) throw new Error('Cashier not found');

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    return prisma.cashier.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCashier(id: string) {
    const cashier = await prisma.cashier.findUnique({ where: { id } });
    if (!cashier || cashier.isDeleted) throw new Error('Cashier not found');

    return prisma.cashier.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
