import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent {
  placingOrder = false;
  error: string | null = null;

  constructor(
    public cart: CartService,
    private ordersApi: OrderService,
    private router: Router
  ) {}

  trackByFoodId(_: number, item: CartItem): number {
    return item.food.id;
  }

  updateQty(foodId: number, qty: string): void {
    const n = Math.max(0, Math.floor(Number(qty)));
    this.cart.updateQuantity(foodId, n);
  }

  remove(foodId: number): void {
    this.cart.removeItem(foodId);
  }

  placeOrder(): void {
    this.error = null;
    const items = this.cart.getSnapshot();
    if (items.length === 0) return;

    this.placingOrder = true;
    const payload = {
      items: items.map((i) => ({ foodId: i.food.id, quantity: i.quantity }))
    };

    this.ordersApi.createOrder(payload).subscribe({
      next: (order) => {
        this.cart.clear();
        this.placingOrder = false;
        this.router.navigate(['/order-summary', order.id], { state: { order } });
      },
      error: (err) => {
        this.placingOrder = false;
        this.error =
          err?.error?.message ||
          'Failed to place order. Check available stock and backend logs.';
      }
    });
  }
}

