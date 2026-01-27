import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  categories: string[] = ['All'];
  loading = true;
  error: string | null = null;

  constructor(
    private foodService: FoodService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.foodService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories API response:', data);
        const normalized = (data ?? [])
          .map((c) => (c ?? '').trim())
          .filter((c) => c.length > 0);

        // De-duplicate case-insensitively, keep first occurrence
        const seen = new Set<string>();
        const unique = normalized.filter((c) => {
          const key = c.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        this.categories = ['All', ...unique];
        console.log('Sidebar categories bound:', this.categories);
        this.loading = false;
      },
      error: (err) => {
        console.error('Category API failed', err);
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  selectCategory(name: string): void {
    if (name.toLowerCase() === 'all') {
      this.categoryService.setSelectedCategory(null);
      return;
    }
    this.categoryService.setSelectedCategory(name);
  }

  isSelected(name: string | null): boolean {
    const selected = this.categoryService.getSelectedCategorySnapshot();
    if (!name || name.toLowerCase() === 'all') {
      return !selected;
    }
    return selected?.toLowerCase() === name.toLowerCase();
  }
}


