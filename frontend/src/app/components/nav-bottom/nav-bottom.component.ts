import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-nav-bottom',
  templateUrl: './nav-bottom.component.html'
})
export class NavBottomComponent {
  constructor(public cart: CartService) {}
}

