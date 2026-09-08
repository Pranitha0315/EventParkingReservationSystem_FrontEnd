import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { checkoutGuard } from './core/guards/checkout.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'events' },

  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', canActivate: [guestGuard], loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'reset-password.html', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'verify-email', loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'verify.html', loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },

  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  {
    path: 'events', canActivate: [authGuard], loadComponent: () => import('./shared/components/route-shell/route-shell.component').then(m => m.RouteShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/events/event-list/event-list.component').then(m => m.EventListComponent) },
      { path: ':id/seats', loadComponent: () => import('./features/seats/seat-map/seat-map.component').then(m => m.SeatMapComponent) },
      { path: ':id/parking', loadComponent: () => import('./features/parking/parking-map/parking-map.component').then(m => m.ParkingMapComponent) },
      { path: ':id', loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent) }
    ]
  },
  { path: 'checkout', canActivate: [authGuard, checkoutGuard], loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  {
    path: 'bookings', canActivate: [authGuard], loadComponent: () => import('./shared/components/route-shell/route-shell.component').then(m => m.RouteShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent) },
      { path: ':id/payment', loadComponent: () => import('./features/payments/payment-page/payment-page.component').then(m => m.PaymentPageComponent) },
      { path: ':id', loadComponent: () => import('./features/bookings/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent) }
    ]
  },
  {
    path: 'payments', canActivate: [authGuard], loadComponent: () => import('./shared/components/route-shell/route-shell.component').then(m => m.RouteShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/payments/payment-history/payment-history.component').then(m => m.PaymentHistoryComponent) },
      { path: ':id/receipt', loadComponent: () => import('./features/payments/receipt/receipt.component').then(m => m.ReceiptComponent) }
    ]
  },
  { path: 'notifications', canActivate: [authGuard], loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },

  { path: 'admin/login', canActivate: [guestGuard], data: { admin: true }, loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./shared/components/route-shell/route-shell.component').then(m => m.RouteShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'customers', loadComponent: () => import('./features/admin/customers/admin-customers.component').then(m => m.AdminCustomersComponent) },
      { path: 'venues', loadComponent: () => import('./features/admin/venues/admin-venues.component').then(m => m.AdminVenuesComponent) },
      { path: 'categories', loadComponent: () => import('./features/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'events', loadComponent: () => import('./features/admin/events/admin-events.component').then(m => m.AdminEventsComponent) },
      { path: 'layouts', loadComponent: () => import('./features/admin/layouts/admin-layouts.component').then(m => m.AdminLayoutsComponent) },
      { path: 'bookings', loadComponent: () => import('./features/admin/bookings/admin-bookings.component').then(m => m.AdminBookingsComponent) }
    ]
  },

  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

