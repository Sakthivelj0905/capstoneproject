import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddpackageComponent } from './admin-addpackage.component';

describe('AdminAddpackageComponent', () => {
  let component: AdminAddpackageComponent;
  let fixture: ComponentFixture<AdminAddpackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAddpackageComponent]
    });
    fixture = TestBed.createComponent(AdminAddpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
