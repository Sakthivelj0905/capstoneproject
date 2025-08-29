import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../services/travel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
})
export class PackagesComponent implements OnInit {
  packages: any[] = [];
  filteredPackages: any[] = [];
  searchText: string = '';

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit() {
    this.loadPackages();
  }

  bookNow(id: number) {
    this.router.navigate(['/booking', id]);
  }
  
  // Fetch packages from backend
  loadPackages() {
    this.travelService.getPackages().subscribe((res: any[]) => {
      this.packages = res;
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
