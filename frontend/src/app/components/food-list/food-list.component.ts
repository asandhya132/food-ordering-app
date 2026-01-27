import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Food } from '../../models/food.model';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html'
})
export class FoodListComponent {
  @Input() foods: Food[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() viewDetails = new EventEmitter<Food>();
  
  @Output() addToCart = new EventEmitter<Food>();

  onDetails(food: Food): void {
    this.viewDetails.emit(food);
  }

  onAdd(food: Food): void {
    this.addToCart.emit(food);
  }
}

