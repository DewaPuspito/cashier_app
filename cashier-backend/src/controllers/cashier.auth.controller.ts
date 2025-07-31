import { Request, Response } from 'express';
import { cashierAuthService } from '../services/cashier.auth.service';

export class cashierAuthController {
  private authService = new cashierAuthService();

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
