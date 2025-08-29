import { Component, OnInit } from '@angular/core';
import { AdminService, Admin, Customer } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  admins: Admin[] = [];
  filteredAdmins: Admin[] = [];
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  newAdmin: Admin & { confirmPassword?: string } = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  newCustomer: Customer = { name: '', email: '' };
  showAdminForm: boolean = false;
  selectedView: 'admin' | 'customer' = 'admin';
  adminSearch: string = '';
  customerSearch: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadCustomers();
  }

  // --- View toggle ---
  selectView(view: 'admin' | 'customer') {
    this.selectedView = view;
    this.adminSearch = '';
    this.customerSearch = '';
    this.showAdminForm = false; 
  }

  // --- Admin modal ---
  openAdminForm() {
    this.showAdminForm = true;
    document.querySelector('.container')?.classList.add('blur');
  }

  cancelAdminForm() {
    this.showAdminForm = false;
    document.querySelector('.container')?.classList.remove('blur');
    this.newAdmin = { name: '', email: '', password: '', confirmPassword: '' };
  }

  // --- Admin CRUD ---
  loadAdmins() {
    this.adminService.getUsers().subscribe((data: Admin[]) => {
      this.admins = data.filter((u) => u.role === 'admin');
      this.filteredAdmins = [...this.admins];
    });
  }

  addAdmin() {
    if (
      !this.newAdmin.name ||
      !this.newAdmin.email ||
      !this.newAdmin.password ||
      !this.newAdmin.confirmPassword
    ) {
      alert('All fields are required!');
      return;
    }
    if (this.newAdmin.password !== this.newAdmin.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.adminService.registerAdmin(this.newAdmin).subscribe(() => {
      this.loadAdmins();
      this.cancelAdminForm(); 
    });
  }

  blockAdmin(id: number) {
    this.adminService
      .updateStatus(id, 'blocked')
      .subscribe(() => this.loadAdmins());
  }

  unblockAdmin(id: number) {
    this.adminService
      .updateStatus(id, 'active')
      .subscribe(() => this.loadAdmins());
  }

  deleteAdmin(id: number) {
    this.adminService.deleteUser(id).subscribe(() => this.loadAdmins());
  }

  searchAdmins() {
    const term = this.adminSearch.toLowerCase();
    this.filteredAdmins = this.admins.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term)
    );
  }

  // --- Customer CRUD ---
  loadCustomers() {
    this.adminService.getUsers().subscribe((data: Admin[]) => {
      this.customers = data.filter((u) => u.role === 'customer');
      this.filteredCustomers = [...this.customers];
    });
  }

  blockCustomer(id: number) {
    this.adminService
      .updateStatus(id, 'blocked')
      .subscribe(() => this.loadCustomers());
  }

  unblockCustomer(id: number) {
    this.adminService
      .updateStatus(id, 'active')
      .subscribe(() => this.loadCustomers());
  }

  deleteCustomer(id: number) {
    this.adminService.deleteUser(id).subscribe(() => this.loadCustomers());
  }

  searchCustomers() {
    const term = this.customerSearch.toLowerCase();
    this.filteredCustomers = this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }
}
