import { prisma } from '../prisma/client';
import { TransactionInput } from '../models/interface';

export class TransactionService {
  async createTransaction(input: TransactionInput) {
    const { cashierId, shiftId, items, paymentType, cashReceived, cardNumber } = input;

    if (paymentType === 'CASH' && (cashReceived === undefined || cashReceived === null)) {
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

    const amount = items.reduce((sum, item) => {
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
          cashierId,
          paymentType,
          cashReceived: paymentType === 'CASH' ? cashReceived : null,
          cashChange: paymentType === 'CASH' ? cashReceived! - amount : null,
          cardNumber: paymentType === 'DEBIT' ? cardNumber : null,
          amount,
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
    
        await tx.shift.update({
          where: { id: shiftId },
          data: {
            totalIncome: {
              increment: amount
            }
          }
        });
    
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
