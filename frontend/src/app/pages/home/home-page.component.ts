import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface HeroSlide {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface CategoryCard {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit, OnDestroy {
  heroSlides: HeroSlide[] = [
    {
      title: 'Authentic Homemade Taste',
      subtitle: 'Enjoy traditional recipes made with love and local ingredients.',
      imageUrl:
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Prepared with 100% Hygiene & Care',
      subtitle: 'Clean kitchens, fresh ingredients, and safe packaging for every order.',
      imageUrl:
        'https://images.unsplash.com/photo-1542736667-069246bdbc94?auto=format&fit=crop&w=1400&q=80'
    }
  ];

  currentSlide = 0;
  private slideTimerId: any;

  categories: CategoryCard[] = [
    {
      name: 'Sweets',
      imageUrl:
        'https://images.unsplash.com/photo-1607920591413-4ec007e70059?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Veg Pickles',
      imageUrl:
        'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Non-Veg Pickles',
      imageUrl:
        'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Karam Podi',
      imageUrl:
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Chocolates',
      imageUrl:
        'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simple auto-slide for hero carousel
    this.slideTimerId = setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  ngOnDestroy(): void {
    if (this.slideTimerId) {
      clearInterval(this.slideTimerId);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  /**
   * Navigate to foods list filtered by the chosen category.
   * The category is passed via query param so the Foods page can call /foods?category=...
   */
  openCategory(category: CategoryCard): void {
    this.router.navigate(['/foods'], {
      queryParams: { category: category.name }
    });
  }

  /**
   * Scroll the categories container horizontally when arrows are clicked.
   */
  scrollCategories(direction: 'left' | 'right', container: HTMLElement): void {
    const delta = direction === 'left' ? -260 : 260;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  }
}

