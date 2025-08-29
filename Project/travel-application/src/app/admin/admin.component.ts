import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
   constructor(private router: Router) {}

  navigateTo(page: string) {
    switch(page) {
      case 'manage':
        this.router.navigate(['/manage']);
        break;
      case 'reviews':
        this.router.navigate(['/adminreviews']);
        break;
      case 'bookings':
        this.router.navigate(['/bookinglist']);
        break;
    }
  }
}