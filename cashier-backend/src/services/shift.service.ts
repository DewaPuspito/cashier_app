import { prisma } from "../prisma/client";
import { ShiftStartInput, ShiftEndInput } from "../models/interface";

export class ShiftService {
  async startShift(cashierId: string, data: ShiftStartInput) {
    const activeShift = await prisma.shift.findFirst({
      where: {
        cashierId,
        endTime: null,
      },
    });

    if (activeShift) {
      throw new Error("You already have an active shift");
    }

    return await prisma.shift.create({
      data: {
        cashierId,
        startCash: data.startCash,
        totalIncome: 0
      },
    });
  }

  async endShift(cashierId: string, data: ShiftEndInput) {
    const activeShift = await prisma.shift.findFirst({
      where: {
        cashierId,
        endTime: null,
      },
      orderBy: { startTime: "desc" },
    });

    if (!activeShift) {
      throw new Error("No active shift found");
    }

    return await prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        endCash: data.endCash,
        endTime: new Date(),
      },
    });
  }
}
