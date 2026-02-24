import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html'
})
export class NavTopComponent {
  constructor(
    public cart: CartService,
    public router: Router
  ) {}
}

