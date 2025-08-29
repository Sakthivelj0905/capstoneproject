import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../services/travel.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(private reviewService: TravelService) {}

  ngOnInit(): void {
    this.reviewService.getReviews().subscribe((data: any) => {
      this.reviews = data.slice().reverse().slice(0, 3);;
    });
  }
}
