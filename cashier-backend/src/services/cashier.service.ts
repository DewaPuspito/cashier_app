import { prisma } from '../prisma/client';
import { hash } from 'bcrypt';

export class CashierService {
  async getAll() {
    return prisma.cashier.findMany({ where: { isDeleted: false } });
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
