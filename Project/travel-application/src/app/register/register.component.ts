import { Component } from '@angular/core';
import { AdminService, Customer } from '../services/admin.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  popupOpen = false;
  popupMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  // ✅ Now form is passed from template
  onRegister(form: NgForm) {
    // If invalid, show validation messages
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // Confirm password check
    if (this.password !== this.confirmPassword) {
      this.popupMessage = 'Passwords do not match!';
      this.openPopup();
      return;
    }

    const newCustomer: Customer = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.adminService.addCustomer(newCustomer).subscribe(
      (response: any) => {
        this.popupMessage = response.message || 'Registration successful!';
        this.openPopup();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

        form.resetForm();
      },
      (error) => {
        this.popupMessage = error.error?.error || 'Registration failed!';
        this.openPopup();
      }
    );
  }

  openPopup() {
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
  }
}
