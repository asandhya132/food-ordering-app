import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderResponse } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-summary-page',
  templateUrl: './order-summary-page.component.html'
})
export class OrderSummaryPageComponent implements OnInit {
  orderId: number | null = null;
  order: OrderResponse | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersApi: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    const nav = this.router.getCurrentNavigation();
    this.order = (nav?.extras?.state as any)?.order || null;

    if (!this.order && this.orderId) {
      this.loading = true;
      this.ordersApi.getById(this.orderId).subscribe({
        next: (o) => {
          this.order = o;
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load order details. Is the backend running?';
          this.loading = false;
        }
      });
    }
  }
}

