import { Request, Response } from 'express';
import { adminAuthService } from '../services/admin.auth.service';
import { AdminRegister } from "../models/interface";

export class adminAuthController {
  private authService = new adminAuthService();

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const data: AdminRegister = req.body;
      const result = await this.authService.register(data);
  
      res.status(201).json({
        message: "Registration successful",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        message: "Registration failed"
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
    
        const result = await this.authService.login(email, password);

        res.status(200).json({
            message: 'Login successful',
            data: result
        })

    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized : Login failed, check your password',
            error: error
        })
    }
  }
}
