// food-list.component.ts
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Food, FoodWeight } from '../../models/food.model';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';


@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit, OnDestroy {
  @Input() foods: Food[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() viewDetails = new EventEmitter<Food>();
  // We now handle cart updates locally via CartService; no need to emit addToCart.

  // Local per-item quantity state keyed by food.id
  private quantities = new Map<string, number>();
  private sub?: Subscription;
  priceMultiplier: Record<FoodWeight, number> = {
  '250g': 1,
  '500g': 2,
  '1kg': 4
};

showAddPopup = false;
lastAddedFoodName = '';

  constructor(private readonly cart: CartService) {}

selectedWeights: Record<number, FoodWeight> = {};
selectWeight(food: Food, weight: FoodWeight) {
  this.selectedWeights[food.id] = weight;
}
getSelectedWeight(food: Food): FoodWeight | undefined {
  return this.selectedWeights[food.id];
}

getDisplayPrice(food: Food): number {
  const weight = this.getSelectedWeight(food) ?? '250g';
  return food.price * this.priceMultiplier[weight];
}

private restoredFromCart = false;

  ngOnInit(): void {
  this.sub = this.cart.items$.subscribe((items: CartItem[]) => {
    const map = new Map<string, number>();

    for (const item of items) {
      const weight = item.food.selectedWeight;
      if (!weight) continue;

      const key = `${item.food.id}_${weight}`;
      map.set(key, item.quantity);

      // ✅ restore only ONCE, do not override user choice
      if (!this.restoredFromCart && !this.selectedWeights[item.food.id]) {
        this.selectedWeights[item.food.id] = weight;
      }
    }

    this.quantities = map;
    this.restoredFromCart = true;
  });
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getQuantity(food: Food): number {
  const weight = this.getSelectedWeight(food);
  if (!weight) return 0;

  const key = `${food.id}_${weight}`;
  return this.quantities.get(key) ?? 0;
}

  onDetails(food: Food): void {
    this.viewDetails.emit(food);
  }

  // Add to cart starts at quantity 1
  onAdd(food: Food): void {
  if (food.availableQuantity <= 0) {
    return;
  }
  
  const selectedWeight = this.getSelectedWeight(food);
  if (!selectedWeight) {
    return; // weight not selected → block add to cart
  }
   const finalPrice =
    food.price * this.priceMultiplier[selectedWeight];


 this.cart.addToCart(
    {
      ...food,
      selectedWeight,
      price: finalPrice
    },
    1
  );
    this.lastAddedFoodName = `${food.name} (${selectedWeight})`;
  this.showAddPopup = true;

}

isInCart(food: Food): boolean {
  const weight = this.getSelectedWeight(food);
  if (!weight) return false;
  return this.getQuantity(food) > 0;
}

  // Increase quantity by 1 up to availableQuantity
  increment(food: Food): void {
  const weight = this.getSelectedWeight(food);
  if (!weight) return;

  const current = this.getQuantity(food);
  if (current < food.availableQuantity) {
    this.cart.addToCart({ ...food, selectedWeight: weight }, 1);
  }
}

  // Decrease quantity; remove from cart if it hits 0
  decrement(food: Food): void {
  const weight = this.getSelectedWeight(food);
  if (!weight) return;

  const key = `${food.id}_${weight}`;
  const current = this.getQuantity(food);
  const next = current - 1;

  if (next <= 0) {
    this.cart.removeItemByKey(key);
  } else {
    this.cart.updateQuantityByKey(key, next);
  }
}
}