import { RequestCollection } from "../types/express";
import { Response } from "express";
import { ShiftService } from "../services/shift.service";
import { ShiftStartInput, ShiftEndInput, ShiftResponse } from "../models/interface";

export class ShiftController {
  private shiftService = new ShiftService();

  public async startShift(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.cashier?.id!;
      const body: ShiftStartInput = req.body;

      const result = await this.shiftService.startShift(cashierId, body);
      res.status(201).json({ message: "Shift started", data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to start shift" });
    }
  }

  public async endShift(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.cashier?.id!;
      const body: ShiftEndInput = req.body;

      const result = await this.shiftService.endShift(cashierId, body);
      res.status(200).json({ message: "Shift ended", data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to end shift" });
    }
  }
}
