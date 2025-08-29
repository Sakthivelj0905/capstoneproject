import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { PackagesComponent } from './components/packages/packages.component';
import { BookingComponent } from './components/booking/booking.component';
import { HistoryComponent } from './components/history/history.component';
import { AdminComponent } from './admin/admin.component';
import { AdminAddpackageComponent } from './components/admin-addpackage/admin-addpackage.component';
import { AdminPackagesComponent } from './components/admin-packages/admin-packages.component';
import { AdminBookinglistComponent } from './components/admin-bookinglist/admin-bookinglist.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { roleGuard } from './guard/role.guard';
import { FallbackComponent } from './components/fallback/fallback.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    {path: 'fallback',component:FallbackComponent},

  // Customer routes
  {path: 'customer',component: CustomerComponent,canActivate: [roleGuard],data: { role: 'customer' },},
  {path: 'booking/:id',component: BookingComponent,canActivate: [roleGuard],data: { role: 'customer' },},
  {path: 'history',component: HistoryComponent,canActivate: [roleGuard],data: { role: 'customer' },},
  {path: 'packages',component: PackagesComponent,canActivate: [roleGuard],data: { role: 'customer' },},

  // Admin routes
  {path: 'admin',component: AdminComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'manage',component: AdminPackagesComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'bookinglist',component: AdminBookinglistComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'adminreviews',component: AdminReviewsComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'add',component: AdminAddpackageComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'admin/edit/:id',component: AdminAddpackageComponent,canActivate: [roleGuard],data: { role: 'admin' },},
  {path: 'adminpanel',component: AdminPanelComponent,canActivate: [roleGuard],data: { role: 'admin' },},

  // Fallback route
  { path: '**', redirectTo: 'fallback' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
