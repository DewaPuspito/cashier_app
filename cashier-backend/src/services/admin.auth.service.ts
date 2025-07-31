import { prisma } from "../prisma/client";
import bcrypt, { hash } from "bcrypt";
import { JwtUtils } from "../lib/token.config";
import { AdminRegister } from "../models/interface";

export class adminAuthService {
  public async register(data: AdminRegister) {
    const { name, email, password } = data;

    const existingUser = await prisma.admin.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = JwtUtils.generateToken({
      adminId: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      adminId: user.id,
      name: user.name,
      access_token: token,
    };
  }

  public async login(email: string, password: string) {
    const user = await prisma.admin.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = JwtUtils.generateToken({
      adminId: user.id,
      name: user.name,
      email: user.email
    });

    return {
      adminId: user.id,
      name: user.name,
      access_token: token,
    };
  }
}
