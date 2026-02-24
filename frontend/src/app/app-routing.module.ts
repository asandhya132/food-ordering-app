import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodListPageComponent } from './pages/food-list/food-list-page.component';
import { FoodDetailsPageComponent } from './pages/food-details/food-details-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { OrderSummaryPageComponent } from './pages/order-summary/order-summary-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page/checkout-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: FoodListPageComponent },
  { path: 'foods/:id', component: FoodDetailsPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },   // ✅ new
  { path: 'order-summary/:orderId', component: OrderSummaryPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

