import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Food } from '../../models/food.model';
import { CartService } from '../../services/cart.service';
import { FoodService } from '../../services/food.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-food-list-page',
  templateUrl: './food-list-page.component.html'
})
export class FoodListPageComponent implements OnInit, OnDestroy {
  foods: Food[] = [];
  loading = true;
  error: string | null = null;

  private categorySub?: Subscription;

  constructor(
    private foodsApi: FoodService,
    private cart: CartService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categorySub = this.categoryService.selectedCategory$.subscribe((category) => {
      this.fetchFoods(category);
    });

    // initial load (in case sidebar hasn't emitted yet)
    this.fetchFoods(this.categoryService.getSelectedCategorySnapshot());
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

  private fetchFoods(category: string | null): void {
    this.loading = true;
    this.error = null;
    this.foodsApi.getAll(category).subscribe({
      next: (data) => {
        this.foods = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load foods. Is the backend running on :8080?';
        this.loading = false;
      }
    });
  }

  openDetails(food: Food): void {
    this.router.navigate(['/foods', food.id]);
  }

  add(food: Food): void {
    this.cart.addToCart(food, 1);
  }
}

