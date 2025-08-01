import { Response, NextFunction } from "express";
import { RequestCollection } from "../types/express";
import { JwtUtils } from "../lib/token.config";
import { prisma } from "../prisma/client";

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
      if (!req.cashier) {
        res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        return;
      }
  
      const userIdFromToken = req.cashier.id;
      const shiftIdFromParams = req.params.id; // ← cukup ambil sebagai string
  
      if (!shiftIdFromParams) {
        res.status(400).json({ message: 'Bad Request: Shift ID is required' });
        return;
      }
  
      prisma.shift.findUnique({ where: { id: shiftIdFromParams } })
        .then(shift => {
          if (!shift) {
            res.status(404).json({ message: 'Shift not found' });
            return;
          }
  
          if (shift.cashierId !== userIdFromToken) {
            res.status(403).json({
              message: 'Forbidden: You can only update your own shift'
            });
            return;
          }
  
          req.shift = shift; // Optional: set agar bisa dipakai di controller
          next();
        })
        .catch(error => {
          res.status(500).json({ message: 'Internal server error', error });
        });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
}