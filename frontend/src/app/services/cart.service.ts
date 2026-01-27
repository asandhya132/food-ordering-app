import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Food } from '../models/food.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  readonly totalItems$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  readonly totalPrice$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.quantity * i.food.price, 0))
  );

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(food: Food, quantity: number = 1): void {
    const current = this.itemsSubject.value;
    const existing = current.find((x) => x.food.id === food.id);

    if (existing) {
      this.updateQuantity(food.id, existing.quantity + quantity);
      return;
    }

    this.itemsSubject.next([...current, { food, quantity }]);
  }

  updateQuantity(foodId: number, quantity: number): void {
    const next = this.itemsSubject.value
      .map((item) => {
        if (item.food.id !== foodId) return item;
        return { ...item, quantity };
      })
      .filter((item) => item.quantity > 0);

    this.itemsSubject.next(next);
  }

  removeItem(foodId: number): void {
    this.itemsSubject.next(this.itemsSubject.value.filter((i) => i.food.id !== foodId));
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}

