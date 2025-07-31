import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AdminPayload, CashierPayload } from '../models/interface';

dotenv.config();

type AnyPayload = AdminPayload | CashierPayload;

export class JwtUtils {
  private static secret: string = process.env.JWT_SECRET || 'default-secret-key';
  private static expiration: `${number}d` = '7d';

  static generateToken(payload: AnyPayload) {
    console.log("GENERATING TOKEN WITH PAYLOAD:", payload);
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiration,
    });
  }

  static verifyToken(token: string): AnyPayload {
    return jwt.verify(token, this.secret) as AnyPayload;
  }
}
