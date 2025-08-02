import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class authController {
  private authService = new authService();
  public async login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password, role } = req.body;
    
        const result = await this.authService.login(email, password, role);

        res.status(200).json({
            message: 'Login successful',
            data: result
        })

    } catch (error: any) {
      console.error('[Login Error]', error.message);
    
      res.status(401).json({
        message: 'Unauthorized: Login failed, check your email or password',
        error: error.message,
      });
    }
    
  }
}
