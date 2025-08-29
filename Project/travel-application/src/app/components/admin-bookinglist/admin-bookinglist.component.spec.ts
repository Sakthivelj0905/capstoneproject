import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBookinglistComponent } from './admin-bookinglist.component';
import { of } from 'rxjs';
import { TravelService } from 'src/app/services/travel.service';

describe('AdminBookinglistComponent', () => {
  let component: AdminBookinglistComponent;
  let fixture: ComponentFixture<AdminBookinglistComponent>;

  // Create a mock TravelService with only the methods used in ngOnInit
  const travelServiceMock = {
    getBookings: () => of([]),
    getPackages: () => of([]),
    bookingsChanged: of(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBookinglistComponent],
      providers: [{ provide: TravelService, useValue: travelServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
