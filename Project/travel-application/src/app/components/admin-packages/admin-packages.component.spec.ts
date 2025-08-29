import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPackagesComponent } from './admin-packages.component';

describe('AdminPackagesComponent', () => {
  let component: AdminPackagesComponent;
  let fixture: ComponentFixture<AdminPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPackagesComponent]
    });
    fixture = TestBed.createComponent(AdminPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
