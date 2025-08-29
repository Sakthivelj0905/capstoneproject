import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/services/travel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.css'],
})
export class AdminPackagesComponent implements OnInit {
  packages: any[] = [];
  filteredPackages: any[] = [];
  searchText: string = '';

  // Popup state
  popupOpen = false;
  popupTitle = '';
  popupMessage = '';
  isConfirmPopup = false;
  confirmAction: (() => void) | null = null;

  openPopup(title: string, message: string, confirmAction?: () => void) {
    this.popupTitle = title;
    this.popupMessage = message;
    this.isConfirmPopup = !!confirmAction; 
    this.confirmAction = confirmAction || null;
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
    this.isConfirmPopup = false;
    this.confirmAction = null;
  }

  onConfirm() {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.closePopup();
  }

  constructor(private packageService: TravelService, private router: Router) {}

  ngOnInit(): void {
    this.loadPackages();
  }
  loadPackages() {
    this.packageService.getPackages().subscribe((res: any[]) => {
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

  // Update package details
  updatePackage(pkg: any): void {
    this.packageService.updatePackage(pkg.id, pkg).subscribe({
      next: (res) => {
        alert('Package updated successfully!');
        this.loadPackages();
      },
      error: (err) => {
        console.error('Error updating package', err);
        alert('Failed to update package.');
      },
    });
  }

  // Delete package
  deletePackage(id: number): void {
  this.openPopup(
    'Confirm Delete',
    'Are you sure you want to delete this package?',
    () => {
      this.packageService.deletePackage(id).subscribe({
        next: () => {
          this.loadPackages(); 
          this.openPopup('Package Deleted', 'The package has been deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting package', err);
          this.openPopup('Error', 'Failed to delete package. Please try again.');
        },
      });
    }
  );
}
}
