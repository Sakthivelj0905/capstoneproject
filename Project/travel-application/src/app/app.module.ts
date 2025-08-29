import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SearchComponent } from './components/search/search.component';
import { BookingComponent } from './components/booking/booking.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { HistoryComponent } from './components/history/history.component';
import { FooterComponent } from './components/footer/footer.component';
import { PackagesComponent } from './components/packages/packages.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminPackagesComponent } from './components/admin-packages/admin-packages.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { AdminBookinglistComponent } from './components/admin-bookinglist/admin-bookinglist.component';
import { AdminAddpackageComponent } from './components/admin-addpackage/admin-addpackage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PopupComponent } from './components/popup/popup.component';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { FallbackComponent } from './components/fallback/fallback.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    NavbarComponent,
    CarouselComponent,
    SearchComponent,
    BookingComponent,
    ReviewsComponent,
    HistoryComponent,
    FooterComponent,
    PackagesComponent,
    AdminComponent,
    AdminNavbarComponent,
    AdminPackagesComponent,
    AdminReviewsComponent,
    AdminBookinglistComponent,
    AdminAddpackageComponent,
    LoginComponent,
    RegisterComponent,
    PopupComponent,
    AdminPanelComponent,
    FallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
