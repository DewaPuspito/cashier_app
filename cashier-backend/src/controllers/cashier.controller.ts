import { RequestCollection } from "../types/express";
import { Response } from "express";
import { CashierService } from "../services/cashier.service";
import { ShiftStartInput, ShiftEndInput, ShiftResponse } from "../models/interface";

export class CashierController {
  private cashierService = new CashierService();

  public async startShift(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.user?.id!;
      const body: ShiftStartInput = req.body;

      const result = await this.cashierService.startShift(cashierId, body);
      res.status(201).json({ message: "Shift started", data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to start shift" });
    }
  }

  public async endShift(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.user?.id!;
      const body: ShiftEndInput = req.body;

      const result = await this.cashierService.endShift(cashierId, body);
      res.status(200).json({ message: "Shift ended", data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to end shift" });
    }
  }

  public async myShifts(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.user?.id!;
      const shifts = await this.cashierService.getMyShifts(cashierId);
  
      const result: ShiftResponse[] = shifts.map(shift => ({
        id: shift.id,
        cashierId: shift.cashierId,
        startCash: shift.startCash,
        endCash: shift.endCash ?? undefined,
        startTime: shift.startTime,
        endTime: shift.endTime ?? undefined,
      }));
  
      res.status(200).json({ message: "Shifts fetched", data: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shifts" });
    }
  }
  
}
