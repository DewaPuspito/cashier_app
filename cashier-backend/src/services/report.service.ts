import { prisma } from "../prisma/client";

export class ReportService {
  async getDailyReport(dateStr: string) {
    const start = new Date(dateStr + "T00:00:00");
    const end = new Date(dateStr + "T23:59:59.999");

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        transactionItems: true,
        shift: true,
      },
    });

    const summary = {
      totalTransactions: transactions.length,
      totalIncome: transactions.reduce((sum, tx) => sum + tx.amount, 0),
      totalCash: transactions
        .filter((tx) => tx.paymentType === "CASH")
        .reduce((sum, tx) => sum + tx.amount, 0),
      totalDebit: transactions
        .filter((tx) => tx.paymentType === "DEBIT")
        .reduce((sum, tx) => sum + tx.amount, 0)
    };

    const shifts = await prisma.shift.findMany({
      where: {
        startTime: { gte: start, lte: end }
      },
      include: {
        cashier: true,
        transactions: true
      }
    });

    const shiftReports = shifts.map((shift) => {
      const cashTx = shift.transactions.filter((t) => t.paymentType === "CASH");
      const debitTx = shift.transactions.filter((t) => t.paymentType === "DEBIT");

      const cashTotal = cashTx.reduce((sum, tx) => sum + tx.amount, 0);
      const debitTotal = debitTx.reduce((sum, tx) => sum + tx.amount, 0);
      const expectedEndCash = shift.startCash + cashTotal;
      const actualEndCash = shift.endCash ?? 0;

      return {
        shiftId: shift.id,
        cashier: {
          id: shift.cashier.id,
          name: shift.cashier.name,
          email: shift.cashier.email
        },
        startCash: shift.startCash,
        endCash: shift.endCash,
        totalIncome: shift.totalIncome ?? 0,
        cashTransaction: cashTotal,
        debitTransaction: debitTotal,
        expectedEndCash,
        isMismatch: actualEndCash !== expectedEndCash
      };
    });

    return {
      date: dateStr,
      summary,
      shifts: shiftReports
    };
  }

  async getDailyItemReport(dateStr: string) {
    const start = new Date(dateStr + "T00:00:00");
    const end = new Date(dateStr + "T23:59:59.999");

    const items = await prisma.transactionItem.groupBy({
      by: ["productId"],
      where: {
        transaction: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      },
      _sum: {
        quantity: true,
        subTotal: true
      }
    });

    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map(i => i.productId) }
      },
      select: {
        id: true,
        name: true
      }
    });

    const report = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || "Unknown Product",
        totalSold: item._sum.quantity || 0,
        totalRevenue: item._sum.subTotal || 0
      };
    });

    return {
      date: dateStr,
      items: report
    };
  }
}
