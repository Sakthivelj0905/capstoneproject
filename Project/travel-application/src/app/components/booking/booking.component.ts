import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  package: any;
  showBookingForm = false;
  instructionList: string[] = [];

  bookingForm = {
    persons: [
      { name: '', mobile: '', email: '', residence: '', age: '', gender: '' },
    ],
    vehicle: '',
    batch: '',
  };

  popupOpen = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.travelService.getPackage(id).subscribe((pkg) => {
      this.package = pkg;

      if (this.package.instructions) {
        this.instructionList = this.package.instructions.split(',');
      } else {
        this.instructionList = [];
      }
    });
  }

  addPerson() {
    this.bookingForm.persons.push({
      name: '',
      mobile: '',
      email: '',
      residence: '',
      age: '',
      gender: '',
    });
  }

  removePerson(i: number) {
    this.bookingForm.persons.splice(i, 1);
  }

  // -------------------- Book Now --------------------
bookNow(bookingNgForm: any) {
    if (!bookingNgForm.valid) {
      // Mark all controls as touched to show validation errors
      Object.values(bookingNgForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?.user_id;

    if (!user || !userId) {
      this.popupMessage = 'Please login to book.';
      this.popupType = 'error';
      this.popupOpen = true;
      return;
    }

    // Format batch date to DD-MM-YYYY
    let formattedBatch = this.bookingForm.batch;
    if (formattedBatch) {
      const parts = formattedBatch.split('-'); // YYYY-MM-DD
      if (parts.length === 3) {
        formattedBatch = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const bookingData = {
      package_id: this.package.id,
      organizer: this.bookingForm.persons[0].name,
      travelers: this.bookingForm.persons,
      vehicle: this.bookingForm.vehicle,
      batch: formattedBatch,
      status: 'pending',
      user_id: userId,
    };

    this.travelService.addBooking(bookingData).subscribe({
      next: (res) => {
        this.popupMessage = 'Booking Confirmed!';
        this.popupType = 'success';
        this.popupOpen = true;
        this.router.navigate(['/history']);

        // Update package slots from backend response
        this.package.slots = res.updated_slots ?? this.package.slots;

        // Reset form
        this.bookingForm = {
          persons: [
            {
              name: '',
              mobile: '',
              email: '',
              residence: '',
              age: '',
              gender: '',
            },
          ],
          vehicle: '',
          batch: '',
        };
        this.showBookingForm = false;
      },
      error: () => {
        this.popupMessage = 'Booking failed, please try again.';
        this.popupType = 'error';
        this.popupOpen = true;
      },
    });
  }


  // -------------------- Cancel Booking --------------------
  cancelBookingAndUpdateSlots(booking: any) {
    this.travelService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.package.slots += booking.travelers.length;
        this.popupMessage = 'Booking cancelled and slots restored!';
        this.popupType = 'success';
        this.popupOpen = true;
      },
      error: () => {
        this.popupMessage = 'Failed to cancel booking.';
        this.popupType = 'error';
        this.popupOpen = true;
      },
    });
  }

  closePopup() {
    this.popupOpen = false;
  }
}
