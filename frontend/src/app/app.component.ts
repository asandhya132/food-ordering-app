import { Component } from '@angular/core';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  sidebarOpen = true;

  constructor(public cart: CartService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

