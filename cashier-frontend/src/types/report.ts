export interface ShiftReport {
    shiftId: string;
    cashier: {
      id: string;
      name: string;
    };
    startCash: number;
    totalIncome: number;
    cashTransaction: number;
    debitTransaction: number;
    expectedEndCash: number;
    endCash: number | null;
    isMismatch: boolean;
  }

export interface SoldProduct {
    productId: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
}

export interface Summary {
    totalTransactions: number;
    totalIncome: number;
    totalCash: number;
    totalDebit: number;
  }
  