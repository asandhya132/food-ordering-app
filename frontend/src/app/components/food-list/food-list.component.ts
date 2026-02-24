// food-list.component.ts
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Food } from '../../models/food.model';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html'
})
export class FoodListComponent implements OnInit, OnDestroy {
  @Input() foods: Food[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() viewDetails = new EventEmitter<Food>();
  // We now handle cart updates locally via CartService; no need to emit addToCart.

  // Local per-item quantity state keyed by food.id
  private quantities = new Map<number, number>();
  private sub?: Subscription;

  constructor(private readonly cart: CartService) {}

  ngOnInit(): void {
    // Keep local quantity map in sync with cart items
    this.sub = this.cart.items$.subscribe((items: CartItem[]) => {
      const map = new Map<number, number>();
      for (const item of items) {
        map.set(item.food.id, item.quantity);
      }
      this.quantities = map;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getQuantity(food: Food): number {
    return this.quantities.get(food.id) ?? 0;
  }

  onDetails(food: Food): void {
    this.viewDetails.emit(food);
  }

  // Add to cart starts at quantity 1
  onAdd(food: Food): void {
    if (food.availableQuantity <= 0) {
      return;
    }
    this.cart.addToCart(food, 1);
  }

  // Increase quantity by 1 up to availableQuantity
  increment(food: Food): void {
    const current = this.getQuantity(food);
    if (current < food.availableQuantity) {
      this.cart.addToCart(food, 1);
    }
  }

  // Decrease quantity; remove from cart if it hits 0
  decrement(food: Food): void {
    const current = this.getQuantity(food);
    const next = current - 1;
    if (next <= 0) {
      this.cart.removeItem(food.id);
    } else {
      this.cart.updateQuantity(food.id, next);
    }
  }
}