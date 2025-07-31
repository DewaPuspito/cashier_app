import { Response, NextFunction } from "express";
import { RequestCollection } from "../types/express";
import { JwtUtils } from "../lib/token.config";

export class AuthenticationMiddleware {
  static verifyToken(req: RequestCollection, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401).json({ message: 'Unauthorized - Token missing' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = JwtUtils.verifyToken(token);
      if ('adminId' in decoded) {
        req.admin = { id: decoded.adminId, ...decoded };
      } else if ('cashierId' in decoded) {
        req.cashier = { id: decoded.cashierId, ...decoded };
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  }
  static checkCashierOwnership(req: RequestCollection, res: Response, next: NextFunction): void {
    try {
      if (!req.cashier || !req.shift) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.cashier!.id !== req.shift!.cashierId) {
        res.status(403).json({ 
          message: 'Forbidden: You can only see or end your own shift',
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        message: 'Internal server error',
        error: error
      });
    }
  }
}