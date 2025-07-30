import { prisma } from '../prisma/client';
import { TransactionInput } from '../models/interface';

export class TransactionService {
  async createTransaction(input: TransactionInput) {
    const { userId, shiftId, items, paymentType, cashAmount, cardNumber } = input;

    // Validasi payment
    if (paymentType === 'CASH' && (cashAmount === undefined || cashAmount === null)) {
      throw new Error("Cash amount is required for CASH payment");
    }
    if (paymentType === 'DEBIT' && (!cardNumber || cardNumber.trim() === '')) {
      throw new Error("Card number is required for DEBIT payment");
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null }
    });

    if (products.length !== items.length) {
      throw new Error('Invalid product(s) in request');
    }

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name}`);
      }
      return sum + product.price * item.quantity;
    }, 0);

    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          shiftId,
          cashierId: userId,
          paymentType,
          cashAmount: paymentType === 'CASH' ? cashAmount : null,
          cardNumber: paymentType === 'DEBIT' ? cardNumber : null,
          total,
          transactionItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              subTotal: products.find(p => p.id === item.productId)!.price * item.quantity
            }))
          }
        }
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      return transaction;
    });
  }

  async getDailyTransactions(cashierId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.transaction.findMany({
      where: {
        cashierId,
        createdAt: { gte: today }
      },
      include: {
        transactionItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
