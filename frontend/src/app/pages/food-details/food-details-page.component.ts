import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Food } from '../../models/food.model';
import { CartService } from '../../services/cart.service';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-food-details-page',
  templateUrl: './food-details-page.component.html'
})
export class FoodDetailsPageComponent implements OnInit {
  food: Food | null = null;
  loading = true;
  error: string | null = null;
  qty = 1;

  constructor(
    private route: ActivatedRoute,
    private foodsApi: FoodService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid food id.';
      this.loading = false;
      return;
    }

    this.foodsApi.getById(id).subscribe({
      next: (data) => {
        this.food = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Food not found.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.food) return;
    const safeQty = Math.max(1, Math.floor(this.qty || 1));
    this.cart.addToCart(this.food, safeQty);
    this.router.navigate(['/cart']);
  }
}

