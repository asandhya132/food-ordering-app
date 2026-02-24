import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { OrderCreateRequest } from '../../models/order.model';
import { RazorpayOrderCreateResponse } from '../../services/payment.service';
import { RazorpayVerifyRequest } from '../../services/payment.service';


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
    this.router.navigate(['/checkout']);
  }
}

