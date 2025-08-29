import { Component } from '@angular/core';
import { TravelService } from '../services/travel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  packages: any[] = [];
  filteredPackages: any[] = [];

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit() {
  this.loadPackages();
  }

  loadPackages() {
    this.travelService.getPackages().subscribe((res: any[]) => {
      this.packages = res.slice().reverse().slice(0, 5);
      this.filteredPackages = [...this.packages]; 
    });
  }

  // Filter packages based on search text
  filterPackages(searchText: string) {
    const text = searchText.toLowerCase();
    this.filteredPackages = this.packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(text)
    );
  }
}
