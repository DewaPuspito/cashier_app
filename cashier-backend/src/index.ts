import express, { Application } from 'express';
import cors from 'cors';
import { AuthRouter } from './routers/auth.routes';
import { CashierRouter } from './routers/cashier.routes';
import { ProductRouter } from './routers/product.routes';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
  }));
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use('/api', new AuthRouter().router);
    this.app.use('/api', new CashierRouter().router);
    this.app.use('/api', new ProductRouter().router);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();