import { Component } from '@angular/core';
import { CartService } from './services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Controls collapse/expand on small screens
  sidebarOpen = true;
  // Controls whether sidebar is rendered at all (only on food listing routes)
  showSidebar = true;

  constructor(
    public cart: CartService,
    private router: Router
  ) {
    // Listen to navigation changes and show sidebar ONLY on food listing routes (/foods).
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        // Sidebar visible only on food list/detail pages.
        this.showSidebar = url.startsWith('/foods');
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

