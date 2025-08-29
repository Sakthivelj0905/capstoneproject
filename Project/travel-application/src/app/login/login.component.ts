import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  popupOpen = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AdminService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        localStorage.setItem('user', JSON.stringify(response));

        // Set popup message
        this.popupMessage =
          response.role === 'admin'
            ? 'Admin login successful!'
            : 'Login successful!';
        this.openPopup();

        // Navigate immediately after storing role
        setTimeout(() => {
          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.role === 'customer') {
            this.router.navigate(['/customer']);
          }
        }, 2000); 
      },
      (error) => {
        this.popupMessage = error.error?.error || 'Invalid credentials!';
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