import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { JwtUtils } from "../lib/token.config";
import { AuthPayload, AdminPayload, CashierPayload } from "../models/interface";

export class authService {
  public async login(email: string, password: string, role: 'admin' | 'cashier') {

    if (role !== 'admin' && role !== 'cashier') {
      throw new Error("Invalid role: must be 'admin' or 'cashier'");
    }

    const user = role === 'admin'
      ? await prisma.admin.findFirst({
          where: { email: { equals: email.trim(), mode: 'insensitive' } }
        })
      : await prisma.cashier.findFirst({
          where: { email: { equals: email.trim(), mode: 'insensitive' } }
        });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const payload: AuthPayload = role === 'admin'
      ? {
          adminId: user.id,
          name: user.name,
          email: user.email,
          role: 'admin'
        } as AdminPayload
      : {
          cashierId: user.id,
          name: user.name,
          email: user.email,
          role: 'cashier'
        } as CashierPayload;

    const token = JwtUtils.generateToken(payload);

    return {
      id: user.id,
      name: user.name,
      access_token: token,
    };
  }
}
