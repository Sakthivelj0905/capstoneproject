import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  id?: number;
  name: string;
  email: string;
  password?: string;
  status?: string;
  role?: string;
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  password?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/users`);
  }

  // Register admin
  registerAdmin(admin: Admin): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/register`, admin);
  }

  // Update user status (block/unblock)
  updateStatus(userId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/status`, {
      status,
    });
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Add a customer
  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }
  // Block admin or customer
  blockUser(userId: number): Observable<any> {
    return this.updateStatus(userId, 'blocked');
  }

  // Delete admin or customer
  deleteCustomer(userId: number): Observable<any> {
    return this.deleteUser(userId);
  }
}
