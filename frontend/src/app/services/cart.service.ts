import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Food } from '../models/food.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  readonly totalItems$ = this.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  readonly totalPrice$ = this.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity * i.food.price, 0))
  );

  // 🔑 unique key
  private getKey(foodId: number, weight: string): string {
    return `${foodId}_${weight}`;
  }

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  // ➕ add / increment
  addToCart(food: Food & { selectedWeight: string }, quantity = 1): void {
    const key = this.getKey(food.id, food.selectedWeight);
    const current = this.itemsSubject.value;

    const existing = current.find(item => item.key === key);

    if (existing) {
      this.updateQuantityByKey(key, existing.quantity + quantity);
      return;
    }

    this.itemsSubject.next([
      ...current,
      {
        key,
        food,
        selectedWeight: food.selectedWeight as any,
        quantity
      }
    ]);
  }

  // ✏️ update
  updateQuantityByKey(key: string, quantity: number): void {
    const next = this.itemsSubject.value
      .map(item =>
        item.key === key ? { ...item, quantity } : item
      )
      .filter(item => item.quantity > 0);

    this.itemsSubject.next(next);
  }

  // ➖ decrement
  decrementByKey(key: string): void {
    const item = this.itemsSubject.value.find(i => i.key === key);
    if (!item) return;

    this.updateQuantityByKey(key, item.quantity - 1);
  }

  // ❌ remove
  removeItemByKey(key: string): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter(i => i.key !== key)
    );
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}