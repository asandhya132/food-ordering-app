import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';

declare var Razorpay: any;

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
    private router: Router,
    private paymentApi: PaymentService
  ) {}

  // ✅ use key, not foodId
  trackByKey(_: number, item: CartItem): string {
    return item.key;
  }

  // ✅ item is passed from template
  updateQty(item: CartItem, qty: string): void {
    const n = Math.max(0, Math.floor(Number(qty)));
    this.cart.updateQuantityByKey(item.key, n);
  }

  // ✅ remove by key
  remove(item: CartItem): void {
    this.cart.removeItemByKey(item.key);
  }

  placeOrder(): void {
    this.error = null;
    const items = this.cart.getSnapshot();
    if (items.length === 0) return;

    this.router.navigate(['/checkout']);
  }
}