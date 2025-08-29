import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../services/travel.service';

@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css'],
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = true;

  popupOpen = false;
  popupTitle = '';
  popupMessage: string = '';
  actionType: 'add' | 'update' | 'cancel' | 'error' | 'confirm' = 'add';

  confirmDeleteId: number | null = null;

  constructor(private travelService: TravelService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.travelService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.openPopup('error', 'Error', 'Failed to load reviews');
      },
    });
  }

  // Popup helper
  openPopup(
    type: 'add' | 'update' | 'cancel' | 'error' | 'confirm',
    title: string,
    message: string = ''
  ) {
    this.actionType = type;
    this.popupTitle = title;
    this.popupMessage = message;
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
    this.confirmDeleteId = null;
  }

  // Step 1: Ask for confirmation
  deleteReview(reviewId: number) {
    this.confirmDeleteId = reviewId;
    this.openPopup(
      'confirm',
      'Confirm Delete',
      'Are you sure you want to delete this review?'
    );
  }

  // Step 2: Handle confirmation from popup
  confirmDelete() {
    if (!this.confirmDeleteId) return;

    this.travelService.deleteReview(this.confirmDeleteId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(
          (r) => r.id !== this.confirmDeleteId
        );
        this.openPopup('update', 'Success', 'Review deleted successfully!');
        this.loadReviews();
      },
      error: () => {
        this.openPopup('error', 'Error', 'Failed to delete review!');
      },
    });

    this.confirmDeleteId = null;
  }
}
