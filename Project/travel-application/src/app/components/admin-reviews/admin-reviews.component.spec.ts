 import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminReviewsComponent } from './admin-reviews.component';
import { TravelService } from '../../services/travel.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminReviewsComponent', () => {
  let component: AdminReviewsComponent;
  let fixture: ComponentFixture<AdminReviewsComponent>;
  let travelServiceMock: any;

  beforeEach(async () => {
    travelServiceMock = {
      getReviews: () => of([{ id: 1, text: 'Good' }]),
      deleteReview: () => of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [AdminReviewsComponent],
      providers: [{ provide: TravelService, useValue: travelServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reviews', () => {
    component.ngOnInit();
    expect(component.reviews.length).toBe(1);
  });

  it('should delete review', () => {
    component.reviews = [{ id: 1, text: 'Good' }];
    component.confirmDeleteId = 1;
    component.confirmDelete();
    expect(component.reviews.length).toBe(0);
  });
});