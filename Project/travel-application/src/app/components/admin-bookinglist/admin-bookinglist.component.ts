import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/services/travel.service';

interface Traveler {
  name: string;
  email: string;
  mobile: string;
  residence: string;
  age: number;
  gender: string;
}

interface Booking {
  id: number;
  organizer: string;
  travelers: Traveler[];
  vehicle: string;
  batch: string;
  package_id: number | null;
  status: string;
  canceled?: boolean;
}
interface Vehicle {
  id: number;
  name: string;
}

interface Package {
  id: number;
  name: string;
  slots: number;
  vehicles?: Vehicle[]; // changed from string[]
  batches?: string[];
}



@Component({
  selector: 'app-admin-bookinglist',
  templateUrl: './admin-bookinglist.component.html',
  styleUrls: ['./admin-bookinglist.component.css'],
})
export class AdminBookinglistComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  searchTerm: string = '';
  showForm: boolean = false;
  isEditing: boolean = false;

  currentBooking: Booking = {
    id: 0,
    organizer: '',
    travelers: [
      { name: '', email: '', mobile: '', residence: '', age: 0, gender: '' },
    ],
    vehicle: '',
    batch: '',
    package_id: null,
    status: 'pending',
  };

  packages: Package[] = [];
  vehicles: string[] = [];
  batches: string[] = [];

  // Popup
  // Popup
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

  constructor(private bookingService: TravelService) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadPackages();
    this.bookingService.bookingsChanged.subscribe(() => {
      this.loadBookings();
    });
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe((res: Booking[]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      this.bookings = res.map((b) => {
        const booking = {
          ...b,
          travelers: b.travelers ? b.travelers : [],
        };

        const batchDateStr = booking.batch.split('-').pop()?.trim();
        if (batchDateStr) {
          const [day, month, year] = batchDateStr.split('/').map(Number);
          const batchDate = new Date(year, month - 1, day);

          // Pending in the past -> Cancelled
          if (batchDate < today && booking.status.toLowerCase() === 'pending') {
            booking.status = 'Cancelled';
          }
          // Confirmed or pending today or earlier -> Completed
          else if (
            batchDate <= today &&
            booking.status.toLowerCase() === 'confirmed'
          ) {
            booking.status = 'completed';
          }
        }

        return booking;
      });

      this.filteredBookings = [...this.bookings];
    });
  }

  loadPackages(): void {
    this.bookingService.getPackages().subscribe((res: Package[]) => {
      this.packages = res;
    });
  }

  onPackageChange(): void {
    const selectedPackage = this.packages.find(
      (p) => p.id === this.currentBooking.package_id
    );

    if (selectedPackage) {
      // Vehicles
      this.vehicles =
        selectedPackage.vehicles?.map((v) =>
          typeof v === 'string' ? v : v.name
        ) || [];

      // Batches in DD-MM-YYYY format
      this.batches =
        selectedPackage.batches?.map((batchStr) => {
          let label = '';
          let datePart = '';

          if (batchStr.includes(' - ')) {
            const parts = batchStr.split(' - ');
            label = parts[0]; 
            datePart = parts[1]; 
          } else {
            datePart = batchStr; 
          }

          // Parse date safely
          let day: number, month: number, year: number;
          if (datePart.includes('/')) {
            [day, month, year] = datePart.split('/').map(Number);
          } else if (datePart.includes('-')) {
            [year, month, day] = datePart.split('-').map(Number);
          } else {
            return batchStr; 
          }

          // Format to DD-MM-YYYY
          const formattedDate = `${day.toString().padStart(2, '0')}-${month
            .toString()
            .padStart(2, '0')}-${year}`;

          return label ? `${label} - ${formattedDate}` : formattedDate;
        }) || [];

      // Set default vehicle and batch
      if (!this.currentBooking.vehicle && this.vehicles.length > 0) {
        this.currentBooking.vehicle = this.vehicles[0];
      }
      if (!this.currentBooking.batch && this.batches.length > 0) {
        this.currentBooking.batch = this.batches[0];
      }
    } else {
      this.vehicles = [];
      this.batches = [];
      this.currentBooking.vehicle = '';
      this.currentBooking.batch = '';
    }
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredBookings = this.bookings.filter((b) => {
      const matchBasic =
        b.organizer.toLowerCase().includes(term) ||
        b.vehicle.toLowerCase().includes(term) ||
        b.batch.toLowerCase().includes(term);

      const matchTravelers = b.travelers.some((t) =>
        t.name.toLowerCase().includes(term)
      );

      return matchBasic || matchTravelers;
    });
  }

  addBookingClick(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentBooking = {
      id: 0,
      organizer: '',
      travelers: [
        { name: '', email: '', mobile: '', residence: '', age: 0, gender: '' },
      ],
      vehicle: '',
      batch: '',
      package_id: null,
      status: 'pending',
    };
  }

  editBooking(booking: Booking): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentBooking = JSON.parse(JSON.stringify(booking));
    this.onPackageChange();
  }

  saveBooking(): void {
    if (this.isEditing) {
      this.bookingService
        .updateBooking(this.currentBooking.id, this.currentBooking)
        .subscribe(() => {
          this.loadBookings();
          this.openPopup(
            'Booking Edited',
            'Booking has been successfully updated.'
          );
        });
    } else {
      this.bookingService.addBooking(this.currentBooking).subscribe(() => {
        this.loadBookings();
        this.openPopup('Booking Added', 'Booking has been successfully added.');
      });
    }
    this.showForm = false;
  }

  deleteBooking(bookingId: number): void {
    this.openPopup(
      'Confirm Delete',
      'Are you sure you want to delete this booking?',
      () => {
        this.bookingService.deleteBooking(bookingId).subscribe(() => {
          this.loadBookings();
          this.openPopup(
            'Booking Deleted',
            'Booking has been deleted successfully.'
          );
        });
      }
    );
  }

  cancelBooking(booking: Booking): void {
    this.openPopup(
      'Confirm Cancel',
      'Are you sure you want to cancel this booking?',
      () => {
        this.bookingService.cancelBooking(booking.id).subscribe({
          next: () => {
            if (booking.package_id) {
              this.bookingService
                .getPackage(booking.package_id)
                .subscribe((pkg: Package) => {
                  const travelersCount = booking.travelers.length;
                  const updatedSlots = (pkg.slots || 0) + travelersCount;

                  this.bookingService
                    .updatePackageSlots(pkg.id, updatedSlots)
                    .subscribe({
                      next: () => {
                        this.loadBookings();
                        this.openPopup(
                          'Booking Canceled',
                          `Booking canceled and ${travelersCount} slots restored.`
                        );
                      },
                      error: () => {
                        this.loadBookings();
                        this.openPopup(
                          'Slot Update Failed',
                          'Booking canceled but failed to restore slots.'
                        );
                      },
                    });
                });
            } else {
              this.loadBookings();
              this.openPopup('Booking Canceled', 'Booking has been canceled.');
            }
          },
          error: () => {
            this.openPopup('Cancel Failed', 'Failed to cancel booking.');
          },
        });
      }
    );
  }

  cancelForm(): void {
    this.showForm = false;
  }

  addTraveler(): void {
    this.currentBooking.travelers.push({
      name: '',
      email: '',
      mobile: '',
      residence: '',
      age: 0,
      gender: '',
    });
  }

  removeTraveler(index: number): void {
    if (this.currentBooking.travelers.length > 1) {
      this.currentBooking.travelers.splice(index, 1);
    }
  }
}
