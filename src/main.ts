import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
}

type View = 'dashboard' | 'products' | 'settings';

interface Preferences {
  language: string;
  dateFormat: string;
  currency: string;
  theme: string;
}

const PRODUCTS: Product[] = [
  { name: 'Wireless Mouse', category: 'Electronics', price: 25, stock: 120 },
  { name: 'Office Chair', category: 'Furniture', price: 150, stock: 40 },
  { name: 'Notebook', category: 'Stationery', price: 3, stock: 500 },
  { name: 'Desk Lamp', category: 'Furniture', price: 35, stock: 80 },
  { name: 'USB-C Cable', category: 'Electronics', price: 10, stock: 300 },
  { name: 'Water Bottle', category: 'Accessories', price: 15, stock: 200 },
  { name: 'Keyboard', category: 'Electronics', price: 45, stock: 60 },
  { name: 'Monitor Stand', category: 'Furniture', price: 55, stock: 30 },
];

const DEFAULT_PREFERENCES: Preferences = {
  language: 'English',
  dateFormat: 'medium',
  currency: 'USD',
  theme: 'light',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
  ],
  template: `
    @if (!loggedIn()) {
      <div class="login-page">
        <div class="login-box">
          <h1 class="logo">IndoLink</h1>
          <p class="subtitle">Welcome back! Please log in.</p>

          <input
            type="text"
            placeholder="Username"
            aria-label="Username"
            [(ngModel)]="username"
          />

          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            [(ngModel)]="password"
          />

          @if (error()) {
            <p class="error">{{ error() }}</p>
          }

          <button
            mat-flat-button
            color="primary"
            class="submit-button"
            (click)="submit()"
          >
            Log in
          </button>

          <div class="social-divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button
            type="button"
            class="social-button"
            (click)="socialSignIn('Google')"
          >
            <svg viewBox="0 0 48 48" width="20" height="20"
                 aria-hidden="true">
              <path fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/>
              <path fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/>
              <path fill="#FBBC05"
                d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.2H5.8a20 20 0 0 0 0 17.6l6.8-5.2Z"/>
              <path fill="#EA4335"
                d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.2l6.8 5.2C14.2 15.6 18.7 12 24 12Z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            class="social-button facebook-button"
            (click)="socialSignIn('Facebook')"
          >
            <svg viewBox="0 0 24 24" width="20" height="20"
                 aria-hidden="true">
              <path fill="#1877F2"
                d="M24 12a12 12 0 1 0-13.875 11.85v-8.38H7.078V12h3.047V9.356c0-3.007 1.791-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953h-1.513c-1.491 0-1.956.926-1.956 1.876V12h3.328l-.532 3.47h-2.796v8.38A12.002 12.002 0 0 0 24 12Z"/>
              <path fill="#fff"
                d="M16.671 15.47 17.203 12h-3.328V9.751c0-.95.465-1.876 1.956-1.876h1.513V4.922s-1.374-.234-2.686-.234c-2.742 0-4.533 1.661-4.533 4.668V12H7.078v3.47h3.047v8.38a12.1 12.1 0 0 0 3.75 0v-8.38h2.796Z"/>
            </svg>
            <span>Continue with Facebook</span>
          </button>

          @if (socialMessage()) {
            <p class="social-message">{{ socialMessage() }}</p>
          }

          <a href="#" class="forgot"
             (click)="$event.preventDefault()">
            Forgot password?
          </a>
        </div>
      </div>
    } @else {
      <div class="app-shell" [class.dark-theme]="preferences.theme === 'dark'">
        <mat-toolbar color="primary" class="topbar">
          <button
            mat-icon-button
            class="mobile-menu"
            aria-label="Toggle navigation"
            (click)="sidebarOpen.set(!sidebarOpen())"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <span class="brand">IndoLink</span>

          <span class="topbar-spacer"></span>

          <span class="header-user">{{ username }}</span>

          <button
            mat-icon-button
            aria-label="User settings"
            title="User settings"
            (click)="navigate('settings')"
          >
            <mat-icon>settings</mat-icon>
          </button>

          <button
            mat-icon-button
            aria-label="Log out"
            title="Log out"
            (click)="logout()"
          >
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <div class="layout">
          @if (sidebarOpen()) {
            <button
              class="sidebar-backdrop"
              aria-label="Close navigation"
              (click)="sidebarOpen.set(false)"
            ></button>
          }

          <aside class="sidebar"
                 [class.sidebar-open]="sidebarOpen()">
            <p class="nav-heading">WORKSPACE</p>

            <button
              class="nav-item"
              [class.active]="view() === 'dashboard'"
              (click)="navigate('dashboard')"
            >
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </button>

            <button
              class="nav-item"
              [class.active]="view() === 'products'"
              (click)="navigate('products')"
            >
              <mat-icon>inventory_2</mat-icon>
              <span>Product List</span>
            </button>

            <p class="nav-heading settings-heading">ACCOUNT</p>

            <button
              class="nav-item"
              [class.active]="view() === 'settings'"
              (click)="navigate('settings')"
            >
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>

            <div class="sidebar-bottom">
              <div class="avatar">{{ username.charAt(0).toUpperCase() }}</div>
              <div class="sidebar-user">
                <b>{{ username }}</b>
                <span>Demo Account</span>
              </div>
            </div>
          </aside>

          <main class="main-content">
            @if (view() === 'dashboard') {
              <div class="page-heading">
                <div>
                  <h1>Dashboard</h1>
                  <p>Welcome back to IndoLink!</p>
                </div>
                <button
                  mat-stroked-button
                  (click)="navigate('settings')"
                >
                  <mat-icon>settings</mat-icon>
                  Preferences
                </button>
              </div>

              <div class="cards">
                <mat-card class="stat-card">
                  <div class="stat-icon blue">
                    <mat-icon>people</mat-icon>
                  </div>
                  <b>Active Users</b>
                  <h2>1,284</h2>
                  <p>Currently active</p>
                </mat-card>

                <mat-card class="stat-card">
                  <div class="stat-icon green">
                    <mat-icon>payments</mat-icon>
                  </div>
                  <b>Revenue</b>
                  <h2>{{ 48200 | currency:preferences.currency:'symbol':'1.0-0' }}</h2>
                  <p>Total revenue</p>
                </mat-card>

                <mat-card class="stat-card">
                  <div class="stat-icon orange">
                    <mat-icon>confirmation_number</mat-icon>
                  </div>
                  <b>Open Tickets</b>
                  <h2>37</h2>
                  <p>Awaiting resolution</p>
                </mat-card>
              </div>

              <mat-card class="content-card chart-card">
                <h3>Weekly Activity</h3>
                <p class="muted">Demo activity for the last seven days</p>

                <div class="bars">
                  @for (v of chart; track $index) {
                    <div class="bar-column">
                      <span class="bar-value">{{ v }}</span>
                      <div
                        class="bar"
                        [style.height.px]="v"
                        [title]="'Activity: ' + v"
                      ></div>
                      <span class="bar-day">{{ days[$index] }}</span>
                    </div>
                  }
                </div>
              </mat-card>

              <mat-card class="content-card">
                <h3>Quick Links</h3>
                <div class="quick-links">
                  <button mat-stroked-button
                          (click)="navigate('products')">
                    <mat-icon>inventory_2</mat-icon>
                    Product List
                  </button>
                  <button mat-stroked-button
                          (click)="navigate('settings')">
                    <mat-icon>settings</mat-icon>
                    User Settings
                  </button>
                </div>
              </mat-card>
            }

            @if (view() === 'products') {
              <div class="page-heading">
                <div>
                  <h1>Product List</h1>
                  <p>Manage and review your product inventory.</p>
                </div>
                <button mat-stroked-button
                        (click)="navigate('settings')">
                  <mat-icon>settings</mat-icon>
                  Settings
                </button>
              </div>

              <div class="product-summary">
                <mat-card class="summary-card">
                  <span>Total Products</span>
                  <h2>{{ allProducts.length }}</h2>
                </mat-card>
                <mat-card class="summary-card">
                  <span>Total Units in Stock</span>
                  <h2>{{ totalStock }}</h2>
                </mat-card>
                <mat-card class="summary-card">
                  <span>Categories</span>
                  <h2>{{ categories.length }}</h2>
                </mat-card>
              </div>

              <mat-card class="content-card">
                <h3>Inventory</h3>

                <div class="filters">
                  <input
                    placeholder="Search by name..."
                    aria-label="Search products by name"
                    [(ngModel)]="searchText"
                    (ngModelChange)="applyFilters()"
                  />

                  <select
                    aria-label="Filter by category"
                    [(ngModel)]="categoryFilter"
                    (ngModelChange)="applyFilters()"
                  >
                    <option value="">All Categories</option>
                    @for (c of categories; track c) {
                      <option [value]="c">{{ c }}</option>
                    }
                  </select>
                </div>

                <div class="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th (click)="sortBy('name')">
                          Name {{ arrow('name') }}
                        </th>
                        <th (click)="sortBy('category')">
                          Category {{ arrow('category') }}
                        </th>
                        <th (click)="sortBy('price')">
                          Price {{ arrow('price') }}
                        </th>
                        <th (click)="sortBy('stock')">
                          Stock {{ arrow('stock') }}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      @for (p of filtered; track p.name) {
                        <tr>
                          <td>{{ p.name }}</td>
                          <td>{{ p.category }}</td>
                          <td>
                            {{ p.price | currency:preferences.currency }}
                          </td>
                          <td>{{ p.stock }}</td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="4" class="empty-state">
                            No products found.
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <p class="table-footer">
                  Showing {{ filtered.length }} of {{ allProducts.length }} products
                </p>
              </mat-card>
            }

            @if (view() === 'settings') {
              <div class="page-heading">
                <div>
                  <h1>User Settings</h1>
                  <p>Manage your profile and application preferences.</p>
                </div>
              </div>

              <mat-card class="content-card profile-card">
                <div class="section-title">
                  <div class="section-icon">
                    <mat-icon>account_circle</mat-icon>
                  </div>
                  <div>
                    <h3>Profile Information</h3>
                    <p class="muted">Your demo account details</p>
                  </div>
                </div>

                <div class="profile-details">
                  <div class="profile-avatar">
                    {{ username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="profile-text">
                    <h2>{{ username }}</h2>
                    <p>{{ profileEmail }}</p>
                    <span class="account-badge">Demo Account</span>
                  </div>
                </div>

                <div class="profile-grid">
                  <div class="profile-field">
                    <span>Username</span>
                    <b>{{ username }}</b>
                  </div>
                  <div class="profile-field">
                    <span>Email</span>
                    <b>{{ profileEmail }}</b>
                  </div>
                  <div class="profile-field">
                    <span>Account Type</span>
                    <b>Standard User</b>
                  </div>
                  <div class="profile-field">
                    <span>Last Login</span>
                    <b>{{ lastLogin | date:preferences.dateFormat }}</b>
                  </div>
                </div>
              </mat-card>

              <mat-card class="content-card preferences-card">
                <div class="section-title">
                  <div class="section-icon">
                    <mat-icon>tune</mat-icon>
                  </div>
                  <div>
                    <h3>Application Preferences</h3>
                    <p class="muted">
                      Customize how IndoLink looks and displays information.
                    </p>
                  </div>
                </div>

                <form (ngSubmit)="savePreferences()">
                  <div class="settings-grid">
                    <div class="form-field">
                      <label for="language">Language</label>
                      <select
                        id="language"
                        name="language"
                        [(ngModel)]="draftPreferences.language"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                      <small>Preferred display language</small>
                    </div>

                    <div class="form-field">
                      <label for="dateFormat">Date Format</label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        [(ngModel)]="draftPreferences.dateFormat"
                      >
                        <option value="medium">Oct 13, 2026, 9:30 PM</option>
                        <option value="shortDate">10/13/26</option>
                        <option value="yyyy-MM-dd">2026-10-13</option>
                        <option value="dd/MM/yyyy">13/10/2026</option>
                      </select>
                      <small>How dates appear in your account</small>
                    </div>

                    <div class="form-field">
                      <label for="currency">Currency</label>
                      <select
                        id="currency"
                        name="currency"
                        [(ngModel)]="draftPreferences.currency"
                      >
                        <option value="USD">USD — US Dollar ($)</option>
                        <option value="INR">INR — Indian Rupee (₹)</option>
                        <option value="EUR">EUR — Euro (€)</option>
                        <option value="GBP">GBP — British Pound (£)</option>
                        <option value="CAD">CAD — Canadian Dollar (CA$)</option>
                      </select>
                      <small>Used for displayed prices</small>
                    </div>

                    <div class="form-field">
                      <label for="theme">Appearance</label>
                      <select
                        id="theme"
                        name="theme"
                        [(ngModel)]="draftPreferences.theme"
                      >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                      </select>
                      <small>Choose your preferred theme</small>
                    </div>
                  </div>

                  <div class="preference-actions">
                    <button
                      mat-flat-button
                      color="primary"
                      type="submit"
                    >
                      <mat-icon>save</mat-icon>
                      Save Preferences
                    </button>

                    <button
                      mat-stroked-button
                      type="button"
                      (click)="resetPreferences()"
                    >
                      Reset
                    </button>
                  </div>

                  @if (saveMessage()) {
                    <p class="save-message">
                      <mat-icon>check_circle</mat-icon>
                      {{ saveMessage() }}
                    </p>
                  }
                </form>
              </mat-card>
            }
          </main>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      color: #20243a;
      background: #f5f7fb;
    }

    * {
      box-sizing: border-box;
    }

    button, input, select {
      font: inherit;
    }

    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: #f4f6fb;
    }

    .login-box {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      max-width: 360px;
      padding: 32px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px #00000012;
    }

    .logo {
      margin: 0;
      color: #3f51b5;
      text-align: center;
      font-size: 32px;
    }

    .subtitle {
      margin: 0 0 10px;
      text-align: center;
      color: #687086;
      font-size: 14px;
    }

    .login-box input {
      width: 100%;
      padding: 12px;
      border: 1px solid #d4d8e2;
      border-radius: 6px;
      outline-color: #3f51b5;
    }

    .submit-button {
      min-height: 42px;
    }

    .error {
      margin: 0;
      color: #c62828;
      font-size: 13px;
    }

    .social-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 4px 0;
    }

    .social-divider span {
      flex: 1;
      height: 1px;
      background: #e0e3eb;
    }

    .social-divider p {
      margin: 0;
      color: #777;
      font-size: 12px;
    }

    .social-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      min-height: 44px;
      padding: 10px;
      border: 1px solid #d4d8e2;
      border-radius: 6px;
      background: white;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .social-button:hover {
      background: #f5f7fa;
    }

    .facebook-button {
      border-color: #1877f2;
      color: #1877f2;
    }

    .facebook-button:hover {
      background: #f0f6ff;
    }

    .social-button svg {
      flex-shrink: 0;
    }

    .social-message {
      margin: 0;
      color: #687086;
      text-align: center;
      font-size: 12px;
    }

    .forgot {
      text-align: center;
      color: #3f51b5;
      font-size: 13px;
      text-decoration: none;
    }

    .app-shell {
      min-height: 100vh;
      background: #f5f7fb;
      color: #20243a;
      transition: background 0.2s, color 0.2s;
    }

    .topbar {
      position: relative;
      z-index: 5;
      display: flex;
      gap: 12px;
      height: 64px;
      padding: 0 20px;
      box-shadow: 0 2px 8px #00000012;
    }

    .brand {
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .topbar-spacer {
      flex: 1;
    }

    .header-user {
      margin-right: 8px;
      font-size: 13px;
    }

    .mobile-menu {
      display: none;
    }

    .layout {
      display: flex;
      min-height: calc(100vh - 64px);
    }

    .sidebar {
      display: flex;
      flex: 0 0 235px;
      flex-direction: column;
      padding: 24px 14px;
      border-right: 1px solid #e3e7f0;
      background: white;
    }

    .nav-heading {
      margin: 4px 12px 12px;
      color: #9299ab;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
    }

    .settings-heading {
      margin-top: 30px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 44px;
      padding: 0 12px;
      margin-bottom: 5px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #596177;
      text-align: left;
      cursor: pointer;
    }

    .nav-item mat-icon {
      color: #7d859a;
    }

    .nav-item:hover {
      background: #f3f5fb;
    }

    .nav-item.active {
      background: #eaf0ff;
      color: #3048a5;
      font-weight: 600;
    }

    .nav-item.active mat-icon {
      color: #3f51b5;
    }

    .sidebar-bottom {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: auto;
      padding: 20px 5px 0;
      border-top: 1px solid #edf0f5;
    }

    .avatar, .profile-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: 50%;
      background: #e4eaff;
      color: #344ca8;
      font-weight: 700;
    }

    .avatar {
      width: 38px;
      height: 38px;
    }

    .sidebar-user {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .sidebar-user b {
      overflow: hidden;
      font-size: 12px;
      text-overflow: ellipsis;
    }

    .sidebar-user span {
      color: #8a91a3;
      font-size: 11px;
    }

    .main-content {
      flex: 1;
      min-width: 0;
      max-width: 1400px;
      padding: 30px;
      margin: 0 auto;
    }

    .page-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    .page-heading h1 {
      margin: 0 0 8px;
      font-size: 27px;
    }

    .page-heading p {
      margin: 0;
      color: #7a8296;
      font-size: 14px;
    }

    .page-heading button,
    .quick-links button {
      flex-shrink: 0;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-bottom: 22px;
    }

    .stat-card {
      padding: 22px;
      border-radius: 10px;
    }

    .stat-card b {
      display: block;
      margin-top: 14px;
      font-size: 13px;
    }

    .stat-card h2 {
      margin: 10px 0 6px;
      font-size: 29px;
      color: #354caf;
    }

    .stat-card p {
      margin: 0;
      color: #8990a2;
      font-size: 12px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 9px;
    }

    .blue {
      color: #4056c2;
      background: #e8edff;
    }

    .green {
      color: #248b61;
      background: #e1f7ec;
    }

    .orange {
      color: #bd791c;
      background: #fff0d8;
    }

    .content-card {
      padding: 24px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px #00000006;
    }

    .content-card h3 {
      margin: 0;
      font-size: 17px;
    }

    .muted {
      color: #838ba0;
      font-size: 12px;
    }

    .chart-card > .muted {
      margin-bottom: 0;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      gap: 14px;
      height: 205px;
      padding: 15px 8px 0;
      margin-top: 10px;
      border-bottom: 1px solid #e0e5ef;
    }

    .bar-column {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      min-width: 0;
      height: 100%;
      flex-direction: column;
    }

    .bar-value, .bar-day {
      color: #828ba0;
      font-size: 11px;
    }

    .bar {
      width: min(100%, 38px);
      min-height: 3px;
      background: #536dfe;
      border-radius: 5px 5px 0 0;
    }

    .quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }

    .product-summary {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .summary-card {
      padding: 20px;
      border-radius: 9px;
    }

    .summary-card span {
      color: #7c8498;
      font-size: 13px;
    }

    .summary-card h2 {
      margin: 10px 0 0;
      color: #354caf;
      font-size: 27px;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 20px 0;
    }

    .filters input, .filters select,
    .form-field select {
      min-height: 42px;
      padding: 10px 12px;
      border: 1px solid #d8ddea;
      border-radius: 6px;
      background: white;
      color: #293149;
    }

    .filters input {
      flex: 1;
      min-width: 200px;
    }

    .filters select {
      min-width: 180px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      border: 1px solid #e8ebf2;
      border-radius: 7px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      padding: 14px;
      border-bottom: 1px solid #edf0f5;
      text-align: left;
      white-space: nowrap;
      font-size: 13px;
    }

    th {
      background: #f5f7fb;
      color: #626b80;
      cursor: pointer;
      user-select: none;
    }

    th:hover {
      background: #e9edf8;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background: #f8f9fd;
    }

    .empty-state {
      padding: 28px;
      color: #828ba0;
      text-align: center;
    }

    .table-footer {
      margin: 16px 0 0;
      color: #858da0;
      font-size: 12px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }

    .section-title h3 {
      margin-bottom: 5px;
    }

    .section-title .muted {
      margin: 0;
    }

    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 9px;
      background: #eaf0ff;
      color: #3f51b5;
    }

    .profile-details {
      display: flex;
      align-items: center;
      gap: 18px;
      padding-bottom: 24px;
      border-bottom: 1px solid #edf0f5;
    }

    .profile-avatar {
      width: 68px;
      height: 68px;
      font-size: 26px;
    }

    .profile-text h2 {
      margin: 0 0 6px;
      font-size: 20px;
    }

    .profile-text p {
      margin: 0 0 10px;
      color: #838ba0;
      font-size: 13px;
    }

    .account-badge {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 20px;
      background: #e7f7ee;
      color: #24794d;
      font-size: 11px;
      font-weight: 600;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
      padding-top: 24px;
    }

    .profile-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .profile-field span {
      color: #858da0;
      font-size: 12px;
    }

    .profile-field b {
      overflow-wrap: anywhere;
      font-size: 13px;
      font-weight: 600;
    }

    .preferences-card form {
      width: 100%;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 9px;
      min-width: 0;
    }

    .form-field label {
      font-size: 13px;
      font-weight: 600;
    }

    .form-field select {
      width: 100%;
      cursor: pointer;
    }

    .form-field small {
      color: #838ba0;
      font-size: 11px;
    }

    .preference-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px;
      padding-top: 22px;
      border-top: 1px solid #edf0f5;
    }

    .save-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 18px 0 0;
      color: #238353;
      font-size: 13px;
    }

    .save-message mat-icon {
      font-size: 19px;
    }

    .dark-theme {
      background: #171b29;
      color: #edf0fa;
    }

    .dark-theme .sidebar,
    .dark-theme .content-card,
    .dark-theme .stat-card,
    .dark-theme .summary-card {
      background: #222839;
      color: #edf0fa;
    }

    .dark-theme .sidebar {
      border-color: #343b4e;
    }

    .dark-theme .sidebar-bottom,
    .dark-theme .profile-details,
    .dark-theme .preference-actions {
      border-color: #343b4e;
    }

    .dark-theme .nav-item {
      color: #d0d6e6;
    }

    .dark-theme .nav-item:hover {
      background: #30384d;
    }

    .dark-theme .nav-item.active {
      background: #35436c;
      color: #ffffff;
    }

    .dark-theme .page-heading p,
    .dark-theme .muted,
    .dark-theme .profile-field span,
    .dark-theme .profile-text p,
    .dark-theme .stat-card p,
    .dark-theme .summary-card span {
      color: #aab3c8;
    }

    .dark-theme .stat-card h2,
    .dark-theme .summary-card h2 {
      color: #aebdff;
    }

    .dark-theme .table-container,
    .dark-theme table {
      background: #222839;
    }

    .dark-theme th {
      background: #30384b;
      color: #e1e6f5;
    }

    .dark-theme td {
      border-color: #343b4e;
    }

    .dark-theme tbody tr:hover {
      background: #2a3144;
    }

    .dark-theme .filters input,
    .dark-theme .filters select,
    .dark-theme .form-field select {
      background: #171b29;
      color: #edf0fa;
      border-color: #454e64;
    }

    .dark-theme .bar-value,
    .dark-theme .bar-day {
      color: #b8c1d6;
    }

    .sidebar-backdrop {
      display: none;
    }

    @media (max-width: 850px) {
      .mobile-menu {
        display: inline-flex;
      }

      .sidebar {
        position: fixed;
        z-index: 10;
        top: 64px;
        bottom: 0;
        left: 0;
        width: 245px;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
        box-shadow: none;
      }

      .sidebar.sidebar-open {
        transform: translateX(0);
        box-shadow: 4px 0 18px #00000016;
      }

      .sidebar-backdrop {
        display: block;
        position: fixed;
        z-index: 9;
        inset: 64px 0 0;
        width: 100%;
        border: none;
        background: #00000040;
      }

      .main-content {
        padding: 24px 18px;
      }
    }

    @media (max-width: 600px) {
      .cards, .product-summary, .settings-grid, .profile-grid {
        grid-template-columns: 1fr;
      }

      .main-content {
        padding: 20px 12px;
      }

      .content-card {
        padding: 17px;
      }

      .page-heading {
        align-items: flex-start;
      }

      .page-heading h1 {
        font-size: 23px;
      }

      .header-user {
        display: none;
      }

      .filters {
        flex-direction: column;
      }

      .filters input, .filters select {
        width: 100%;
      }
    }
  `,
})
export class App {
  loggedIn = signal(false);
  view = signal<View>('dashboard');
  sidebarOpen = signal(false);

  username = '';
  password = '';

  error = signal('');
  socialMessage = signal('');
  selectedLink = signal('');
  saveMessage = signal('');

  lastLogin = new Date();

  profileEmail = 'demo@indolink.example';

  chart = [40, 70, 55, 90, 60, 100, 80];
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  allProducts = PRODUCTS;
  categories = [...new Set(PRODUCTS.map(p => p.category))];

  searchText = '';
  categoryFilter = '';
  filtered: Product[] = [...PRODUCTS];

  sortCol: keyof Product | '' = '';
  sortAsc = true;

  preferences: Preferences = { ...DEFAULT_PREFERENCES };
  draftPreferences: Preferences = { ...DEFAULT_PREFERENCES };

  get totalStock(): number {
    return this.allProducts.reduce((sum, p) => sum + p.stock, 0);
  }

  submit() {
    const user = this.username.trim();
    const pwd = this.password;

    if (user.length < 6) {
      this.error.set('Username must be at least 6 characters.');
      return;
    }

    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length < 8 || !hasDigit || !hasSpecial) {
      this.error.set(
        'Password must be 8+ characters, with a digit and a special character.'
      );
      return;
    }

    this.username = user;
    this.error.set('');
    this.socialMessage.set('');
    this.lastLogin = new Date();
    this.view.set('dashboard');
    this.loggedIn.set(true);
  }

  socialSignIn(provider: string) {
    this.socialMessage.set(
      `${provider} sign-in is not available yet.`
    );
  }

  logout() {
    this.loggedIn.set(false);
    this.password = '';
    this.error.set('');
    this.socialMessage.set('');
    this.selectedLink.set('');
    this.view.set('dashboard');
    this.sidebarOpen.set(false);
  }

  navigate(page: View) {
    this.view.set(page);
    this.sidebarOpen.set(false);
    this.saveMessage.set('');

    if (page === 'settings') {
      this.draftPreferences = { ...this.preferences };
    }
  }

  openLink(event: Event, link: string) {
    event.preventDefault();
    this.selectedLink.set(link);
  }

  savePreferences() {
    this.preferences = { ...this.draftPreferences };
    this.saveMessage.set('Your preferences have been saved.');
  }

  resetPreferences() {
    this.draftPreferences = { ...DEFAULT_PREFERENCES };
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveMessage.set('Preferences have been reset to defaults.');
  }

  applyFilters() {
    this.filtered = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (!this.categoryFilter || p.category === this.categoryFilter)
    );

    if (this.sortCol) {
      this.sortProducts();
    }
  }

  sortBy(col: keyof Product) {
    this.sortAsc = this.sortCol === col ? !this.sortAsc : true;
    this.sortCol = col;
    this.sortProducts();
  }

  private sortProducts() {
    const col = this.sortCol;
    if (!col) return;

    this.filtered = [...this.filtered].sort((a, b) => {
      const cmp = a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0;
      return this.sortAsc ? cmp : -cmp;
    });
  }

  arrow(col: string) {
    if (this.sortCol !== col) return '';
    return this.sortAsc ? '▲' : '▼';
  }
}

bootstrapApplication(App).catch(err => console.error(err));