import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

 @Injectable({
  providedIn: 'root',
})

export class TravelService {
  private apiUrl = 'http://127.0.0.1:8000'; 
  public bookingsChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  // -------------------- Packages --------------------
  getPackages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages`);
  }

  getPackage(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages/${id}`);
  }

  addPackage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/packages`, data);
  }

  updatePackage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/packages/${id}`, data);
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/packages/${id}`);
  }

  updatePackageSlots(id: number, slots: number) {
    return this.http.patch(`${this.apiUrl}/packages/${id}`, { slots });
  }

  // -------------------- Bookings --------------------
  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getUserBookings(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/user/${userId}`);
  }

  addBooking(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, data);
  }

  updateBooking(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${id}`, data);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${id}/cancel`, {});
  }

  // Update only the status of a booking
  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${id}`, { status });
  }

  // -------------------- Reviews --------------------
  getReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews`);
  }

  addReview(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews`, data);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reviews/${id}`);
  }
}
