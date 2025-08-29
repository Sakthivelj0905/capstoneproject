import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomerComponent } from './customer.component';
import { TravelService } from '../services/travel.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;
  let travelServiceMock: any;

  beforeEach(async () => {
    // Mock TravelService
    travelServiceMock = {
      getPackages: jasmine
        .createSpy('getPackages')
        .and.returnValue(
          of([
            { name: 'Paris' },
            { name: 'London' },
            { name: 'Rome' },
            { name: 'Berlin' },
            { name: 'Tokyo' },
            { name: 'New York' },
          ])
        ),
    };

    await TestBed.configureTestingModule({
      declarations: [CustomerComponent],
      providers: [
        { provide: TravelService, useValue: travelServiceMock },
        { provide: Router, useValue: {} }, // Router mock
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown template errors
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
  });

  it('should load latest 5 packages on init', () => {
    component.ngOnInit();
    expect(travelServiceMock.getPackages).toHaveBeenCalled();
    expect(component.packages.length).toBe(5); // Only latest 5
    expect(component.filteredPackages.length).toBe(5);
  });

  it('should filter packages by search text', () => {
    component.ngOnInit(); // Load packages first
    component.filterPackages('paris');
    expect(component.filteredPackages.length).toBe(1);
    expect(component.filteredPackages[0].name).toBe('Paris');
  });

  it('should show all packages when search text is empty', () => {
    component.ngOnInit();
    component.filterPackages('');
    expect(component.filteredPackages.length).toBe(5);
  });
});
