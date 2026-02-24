import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FoodListPageComponent } from './pages/food-list/food-list-page.component';
import { FoodDetailsPageComponent } from './pages/food-details/food-details-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { OrderSummaryPageComponent } from './pages/order-summary/order-summary-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FoodListComponent } from './components/food-list/food-list.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page/checkout-page.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { NavBottomComponent } from './components/nav-bottom/nav-bottom.component';

@NgModule({
  declarations: [
    AppComponent,
    FoodListPageComponent,
    FoodDetailsPageComponent,
    CartPageComponent,
    OrderSummaryPageComponent,
    SidebarComponent,
    FoodListComponent,
    CheckoutPageComponent,
    NavTopComponent,
    NavBottomComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

