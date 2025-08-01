export interface Admin {
    id: string;
    name: string;
    email: string;
    role?: 'ADMIN';
  }
  
  export interface Cashier {
    id: string;
    name: string;
    email: string;
    role?: 'CASHIER';
  }
  
  export type User = Admin | Cashier;