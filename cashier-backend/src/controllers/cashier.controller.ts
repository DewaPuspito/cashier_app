import { Request, Response } from 'express';
import { CashierService } from '../services/cashier.service';

const service = new CashierService();

export class CashierController {
  async getAll(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string || '';
    
    const result = await service.getAll(page, limit, search);
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    try {
      const cashier = await service.getById(req.params.id);
      res.json(cashier);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const created = await service.createCashier({ name, email, password });
    res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await service.updateCashier(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.deleteCashier(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }
}
