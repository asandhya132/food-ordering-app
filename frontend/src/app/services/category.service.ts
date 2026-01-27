import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly selectedCategorySubject = new BehaviorSubject<string | null>(null);
  readonly selectedCategory$ = this.selectedCategorySubject.asObservable();

  setSelectedCategory(category: string | null): void {
    this.selectedCategorySubject.next(category);
  }

  getSelectedCategorySnapshot(): string | null {
    return this.selectedCategorySubject.value;
  }
}



