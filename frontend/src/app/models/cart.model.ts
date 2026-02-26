import { Food, FoodWeight } from './food.model';

export interface CartItem {
   key: string;            // unique: foodId_weight
  food: Food;
  selectedWeight: FoodWeight;
  quantity: number;
}

