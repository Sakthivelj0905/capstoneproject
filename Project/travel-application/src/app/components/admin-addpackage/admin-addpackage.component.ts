import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';
import { Package, Vehicle, Facility } from '../../model/package';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-addpackage',
  templateUrl: './admin-addpackage.component.html',
  styleUrls: ['./admin-addpackage.component.css'],
})
export class AdminAddpackageComponent implements OnInit {
  package: Package = {
    id: undefined,
    name: '',
    overview: '',
    duration: 1,
    slots: 1,
    price: 0,
    itinerary: [],
    vehicles: [],
    facilities: [],
    description: '',
    insights: '',
    suggestions: [],
    batches: [],
    images: [],
    instructions: '',
  };

  isEditMode = false;

  availableVehicles: Vehicle[] = [
    { name: 'Car', icon: '/assets/car.png' },
    { name: 'Bus', icon: '/assets/bus.png' },
    { name: 'Van', icon: '/assets/van.png' },
  ];

  availableFacilities: Facility[] = [
    { name: 'Hotel Stay', icon: '/assets/hotel.png' },
    { name: 'Food', icon: '/assets/food.png' },
    { name: 'Guide', icon: '/assets/guide.png' },
  ];

  popupOpen = false;
  popupTitle = '';
  popupMessage: string = '';
  actionType: 'add' | 'update' | 'cancel' | 'error' = 'add';

  constructor(
    private travelService: TravelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.travelService.getPackage(id).subscribe((pkg) => {
        this.package = pkg;
        this.isEditMode = true;
      });
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  // ----- Form Submission with Validation -----
  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.package.vehicles || this.package.vehicles.length === 0) {
      alert('Please select at least one vehicle.');
      return;
    }

    if (this.isEditMode && this.package.id !== undefined) {
      this.travelService.updatePackage(this.package.id, this.package).subscribe(
        () => {
          this.showPopup('update', 'Package updated successfully!', '/manage');
        },
        (err) => {
          console.error(err);
          this.showPopup('error', 'Failed to update package!');
        }
      );
    } else {
      this.travelService.addPackage(this.package).subscribe(
        () => {
          this.showPopup('add', 'Package added successfully!', '/manage');
        },
        (err) => {
          console.error(err);
          this.showPopup('error', 'Failed to add package!');
        }
      );
    }
  }

  // ---------- Cancel ----------
  cancel() {
    this.showPopup('cancel', 'Action cancelled.', '/manage');
  }

  // ---------- Popup ----------
  showPopup(
    type: 'add' | 'update' | 'cancel' | 'error',
    message: string,
    redirectUrl?: string
  ) {
    this.actionType = type;
    this.popupTitle =
      type === 'add'
        ? 'Add Status'
        : type === 'update'
        ? 'Update Status'
        : type === 'cancel'
        ? 'Cancelled'
        : 'Error';
    this.popupMessage = message;
    this.popupOpen = true;

    if (redirectUrl) {
      setTimeout(() => {
        this.router.navigate([redirectUrl]);
        this.closePopup();
      }, 3000);
    }
  }

  closePopup() {
    this.popupOpen = false;
  }

  // ----- Itinerary -----
  addItinerary() {
    this.package.itinerary.push({ plan: '', duration: '' });
  }
  removeItinerary(index: number) {
    this.package.itinerary.splice(index, 1);
  }

  // ----- Vehicles -----
  onVehicleChange(event: any, vehicle: Vehicle) {
    if (event.target.checked) {
      this.package.vehicles.push(vehicle);
    } else {
      this.package.vehicles = this.package.vehicles.filter(
        (v: Vehicle) => v.name !== vehicle.name
      );
    }
  }
  isVehicleSelected(vehicle: Vehicle): boolean {
    return this.package.vehicles.some((v) => v.name === vehicle.name);
  }

  // ----- Facilities -----
  onFacilityChange(event: any, facility: Facility) {
    if (event.target.checked) {
      this.package.facilities.push(facility);
    } else {
      this.package.facilities = this.package.facilities.filter(
        (f: Facility) => f.name !== facility.name
      );
    }
  }
  isFacilitySelected(facility: Facility): boolean {
    return this.package.facilities.some((f) => f.name === facility.name);
  }

  // ----- Suggestions -----
  addSuggestion() {
    this.package.suggestions.push('');
  }
  removeSuggestion(index: number) {
    this.package.suggestions.splice(index, 1);
  }

  // ----- Batches -----
  addBatch() {
    this.package.batches.push('');
  }
  removeBatch(index: number) {
    this.package.batches.splice(index, 1);
  }

  // ----- Images -----
  addImage() {
    if (!this.package.images) this.package.images = [];
    this.package.images.push('');
  }
  removeImage(index: number) {
    this.package.images.splice(index, 1);
  }
}
