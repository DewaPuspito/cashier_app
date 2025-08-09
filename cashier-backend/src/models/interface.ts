interface BaseAuthPayload {
  name: string;
  email: string;
}

export interface AdminPayload extends BaseAuthPayload {
  adminId: string;
  role: 'admin';
}

export interface CashierPayload extends BaseAuthPayload {
  cashierId: string;
  role: 'cashier';
}

export type AuthPayload = AdminPayload | CashierPayload;

export interface ShiftPayload {
    id: string,
    cashierId: string,
}

export interface ShiftStartInput {
    startCash: number;
  }
  
  export interface ShiftEndInput {
    endCash: number;
  }

  export interface ShiftResponse {
    id: string;
    cashierId: string;
    startCash: number;
    endCash?: number;
    startTime: Date;
    endTime?: Date;
  }

  export interface ProductInput {
    name: string;
    price: number;
    stock: number;
    category: 'FRUITS' | 'VEGETABLES' | 'CANNED_GOODS' | 'DAIRY' | 'MEAT' | 'SEAFOOD' | 'DELI' | 'CONDIMENTS_SPICES' | 'SNACKS' | 
    'BREAD_AND_BAKERY' | 'BEVERAGES' | 'PASTA_RICE_CEREAL' | 'BAKING' | 'FROZEN_FOODS' | 'PERSONAL_CARE' | 'HEALTH_CARE' | 'HOUSEHOLD' |
    'BABY_ITEMS' | 'PET_SUPPLIES' | 'AUTOMOTIVE' | 'ELECTRONICS' | 'SPORTS_OUTDOORS' | 'TOYS' | 'STATIONERIES' | 'CLOTHING'
    imageUrl: string;
  }
  
  export interface ProductQuery {
    search?: string;
    price?: number;
    stock?: number;
    category?: 'FRUITS' | 'VEGETABLES' | 'CANNED_GOODS' | 'DAIRY' | 'MEAT' | 'SEAFOOD' | 'DELI' | 'CONDIMENTS_SPICES' | 'SNACKS' | 
    'BREAD_AND_BAKERY' | 'BEVERAGES' | 'PASTA_RICE_CEREAL' | 'BAKING' | 'FROZEN_FOODS' | 'PERSONAL_CARE' | 'HEALTH_CARE' | 'HOUSEHOLD' |
    'BABY_ITEMS' | 'PET_SUPPLIES' | 'AUTOMOTIVE' | 'ELECTRONICS' | 'SPORTS_OUTDOORS' | 'TOYS' | 'STATIONERIES' | 'CLOTHING'
    imageUrl?: string;
    page?: number;
    limit?: number;
  }
  
  export interface TransactionItemInput {
    productId: string;
    quantity: number;
  }
  
  export interface TransactionInput {
    items: TransactionItemInput[];
    paymentType: 'CASH' | 'DEBIT';
    cashReceived?: number;
    cardNumber?: string;
    cashierId: string;
    shiftId: string;
  }  

  export interface TransactionQuery {
    date?: string; 
    shiftId?: string;
    page?: number;
    limit?: number;
  }  
  