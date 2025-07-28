import { prisma } from "../prisma/client";
import bcrypt, { hash } from "bcrypt";
import { JwtUtils } from "../lib/token.config";
import { UserRegister } from "../models/interface";

export class AuthService {
  public async register(data: UserRegister) {
    const { name, email, password, role = 'CASHIER' } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = JwtUtils.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      access_token: token,
    };
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = JwtUtils.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      access_token: token,
    };
  }
}
