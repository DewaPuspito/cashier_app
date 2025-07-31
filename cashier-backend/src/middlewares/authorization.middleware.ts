import { Response, NextFunction } from "express";
import { RequestCollection } from "../types/express";

export class AuthorizationMiddleware {
    static allowAdmin(req: RequestCollection, res: Response, next: NextFunction) {
      if (!req.admin) {
        return res.status(403).json({ message: 'Admin only' });
      }
      next();
    }
  
    static allowCashier(req: RequestCollection, res: Response, next: NextFunction) {
      if (!req.cashier) {
        return res.status(403).json({ message: 'Cashier only' });
      }
      next();
    }
  }
  