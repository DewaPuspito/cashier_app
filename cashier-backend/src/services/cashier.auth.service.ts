import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { JwtUtils } from "../lib/token.config";

export class cashierAuthService {
  public async login(email: string, password: string) {
    const user = await prisma.cashier.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = JwtUtils.generateToken({
      cashierId: user.id,
      name: user.name,
      email: user.email
    });

    return {
      cashierId: user.id,
      name: user.name,
      access_token: token,
    };
  }
}
