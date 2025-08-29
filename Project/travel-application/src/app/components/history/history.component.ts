import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../services/travel.service';

interface Traveler {
  name: string;
  email: string;
  mobile: string;
  residence: string;
  age: number | null;
  gender: string;
}

interface Booking {
  id: number;
  organizer: string;
  travelers: Traveler[];
  vehicle: string;
  batch: string; 
  package_id: number | null;
  user_id: number;
  status: string; 
  showTravelers?: boolean;
  showTicket?: boolean;
  hasReview?: boolean;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  userBookings: Booking[] = [];
  today: Date = new Date();

  // Pay modal
  showPayModal: boolean = false;
  payInput: string = '';
  currentBookingForPay!: Booking;

  // Review modal
  showReviewModal: boolean = false;
  currentBookingForReview!: Booking;
  currentRating: number = 0;
  reviewText: string = '';

  popupOpen: boolean = false;
  popupMessage: string = '';

  closePopup() {
    this.popupOpen = false;
  }

  constructor(private travelService: TravelService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user?.user_id) return;

    this.travelService.getUserBookings(user.user_id).subscribe(
      (res: Booking[]) => {
        this.userBookings = res.map((b) => ({
          ...b,
          showTravelers: false,
          showTicket: false,
          reviewWritten: false,
        }));

        const today = new Date();

        this.userBookings.forEach((booking) => {
          const batchDate = this.parseBatchDate(booking.batch);
          const diffDays =
            (batchDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

          // Auto-complete confirmed bookings
          if (booking.status === 'confirmed' && today >= batchDate) {
            booking.status = 'completed';
            this.travelService
              .updateBooking(booking.id, { status: 'completed' })
              .subscribe();
          }

          // Auto-cancel pending bookings if less than 2 days left
          if (booking.status === 'pending' && diffDays <= 2) {
            this.cancelBooking(booking, true); 
          }
        });
      },
      (err) => console.error('API error:', err)
    );
  }

  // Toggle travelers
  toggleTravelers(booking: Booking) {
    booking.showTravelers = !booking.showTravelers;
  }

  // Parse DD-MM-YYYY
  parseBatchDate(batch: string): Date {
    const [day, month, year] = batch.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Cancel button
  canCancel(booking: Booking): boolean {
    const batchDate = this.parseBatchDate(booking.batch);
    const diffDays =
      (batchDate.getTime() - this.today.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 2 && booking.status !== 'cancelled';
  }

  cancelBooking(booking: Booking, auto: boolean = false) {
    if (!auto && !this.canCancel(booking)) return;

    this.travelService.cancelBooking(booking.id).subscribe({
      next: () => {
        booking.status = 'cancelled';
        if (!auto) {
          // Dynamic message
          this.popupMessage = `Booking for ${booking.organizer} on ${booking.batch} cancelled successfully!`;
          this.popupOpen = true;
        }
      },
      error: (err) => {
        console.error('Failed to cancel booking', err);
        this.popupMessage = `Failed to cancel booking for ${booking.organizer} on ${booking.batch}.`;
        this.popupOpen = true;
      },
    });
  }

  // Review logic
  showReviewButton(booking: any): boolean {
    return booking.status === 'completed' && !booking.hasReview;
  }
  openReview(booking: Booking) {
    this.currentBookingForReview = booking;
    this.showReviewModal = true;
    this.currentRating = 0;
    this.reviewText = '';
  }
  hoverIndex: number = 0; 

  setRating(star: number) {
    this.currentRating = star;
  }

  submitReview() {
    if (!this.currentBookingForReview) return;

    const user = JSON.parse(localStorage.getItem('user')!);

    const review = {
      booking_id: this.currentBookingForReview.id,
      user_id: user.user_id, 
      name: user.name, 
      rating: this.currentRating,
      comment: this.reviewText,
    };

    this.travelService.addReview(review).subscribe(() => {
      this.currentBookingForReview.hasReview = true;
      this.closeReview();
    });
  }

  closeReview() {
    this.showReviewModal = false;
    this.reviewText = '';
    this.currentRating = 0;
  }

  // Pay Now logic
  openPayPopup(booking: Booking) {
    this.currentBookingForPay = booking;
    this.payInput = '';
    this.showPayModal = true;
  }

  submitPayment() {
    if (this.payInput.trim().toUpperCase() !== 'PAY') return;

    // Update backend
    this.travelService
      .updateBookingStatus(this.currentBookingForPay.id, 'confirmed')
      .subscribe({
        next: () => {
          // Update frontend state after successful DB update
          this.currentBookingForPay.status = 'confirmed';
          this.showPayModal = false;
          console.log(
            `Booking ${this.currentBookingForPay.id} marked confirmed in DB`
          );
        },
        error: (err) =>
          console.error('Failed to update booking status in DB', err),
      });
  }

  closePayPopup() {
    this.showPayModal = false;
  }

  // Ticket logic
  generateTicket(booking: Booking) {
    if (booking.status !== 'confirmed') return;
    booking.showTicket = true;
  }

  closeTicket(booking: Booking) {
    booking.showTicket = false;
  }
}
