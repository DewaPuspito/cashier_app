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
    imageUrl: string | File;
}

export enum Category {
    Fruits = 'FRUITS',
    Vegetables = 'VEGETABLES',
    CannedGoods = 'CANNED_GOODS',
    Dairy = 'DAIRY',
    Meat = 'MEAT',
    Seafood = 'SEAFOOD',
    Deli = 'DELI',
    CondimentsSpices = 'CONDIMENTS_SPICES',
    Snacks = 'SNACKS',
    BreadAndBakery = 'BREAD_AND_BAKERY',
    Beverages = 'BEVERAGES',
    PastaRiceCereal = 'PASTA_RICE_CEREAL',
    Baking = 'BAKING',
    FrozenFoods = 'FROZEN_FOODS',
    PersonalCare = 'PERSONAL_CARE',
    HealthCare = 'HEALTH_CARE',
    Household = 'HOUSEHOLD',
    BabyItems = 'BABY_ITEMS',
    PetSupplies = 'PET_SUPPLIES',
    Automotive = 'AUTOMOTIVE',
    Electronics = 'ELECTRONICS',
    SportsOutdoors = 'SPORTS_OUTDOORS',
    Toys = 'TOYS',
    Stationeries = 'STATIONERIES',
    Clothing = 'CLOTHING'
  }