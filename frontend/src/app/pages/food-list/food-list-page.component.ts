import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Apply category from route query param when landing from Home category cards
    this.route.queryParams.subscribe((params) => {
      const cat = params['category'] as string | undefined;
      if (cat) {
        this.categoryService.setSelectedCategory(cat);
      } else if (this.categoryService.getSelectedCategorySnapshot() == null) {
        this.categoryService.setSelectedCategory(null);
      }
    });

    this.categorySub = this.categoryService.selectedCategory$.subscribe((category) => {
      this.fetchFoods(category);
    });
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
}

