export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
}
  
export interface ProductFormData {
    name: string;
    price: number;
    stock: number;
    category: Category
    imageUrl: string;
}

export enum Category {
    FOOD = 'FOOD',
    DRINK = 'DRINK',
    ELECTRONICS = 'ELECTRONICS',
    STATIONERY = 'STATIONERY',
    CLOTHING = 'CLOTHING',
    HEALTH = 'HEALTH'
  }