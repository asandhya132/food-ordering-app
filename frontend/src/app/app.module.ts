import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FoodListPageComponent } from './pages/food-list/food-list-page.component';
import { FoodDetailsPageComponent } from './pages/food-details/food-details-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { OrderSummaryPageComponent } from './pages/order-summary/order-summary-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FoodListComponent } from './components/food-list/food-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FoodListPageComponent,
    FoodDetailsPageComponent,
    CartPageComponent,
    OrderSummaryPageComponent,
    SidebarComponent,
    FoodListComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

