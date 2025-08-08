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

  async getActiveShift(req: RequestCollection, res: Response) {
    try {
      const cashierId = req.cashier?.id;
      if (!cashierId) {
        throw new Error("Unauthorized");
      }
  
      const activeShift = await this.shiftService.getActiveShift(cashierId);
      if (!activeShift) {
        return res.status(404).json({
          message: "No active shift found"
        });
      }
  
      return res.json({
        message: "Active shift found",
        data: activeShift
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Internal server error"
      });
    }
  }
}
