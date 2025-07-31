import { UserPayload, ShiftPayload } from "../../models/interface";
import { Request } from "express";

export interface RequestCollection extends Request {
    cashier?: CashierPayload,
    admin?: AdminPayload,
    shift?: ShiftPayload,
}