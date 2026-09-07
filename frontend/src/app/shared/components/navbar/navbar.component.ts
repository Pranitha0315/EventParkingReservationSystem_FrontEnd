import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { BookingStateService } from '../../../core/services/booking-state.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly bookingState = inject(BookingStateService);
  readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly navigating = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof NavigationStart) this.navigating.set(true);
      if (event instanceof NavigationEnd) this.navigating.set(false);
    });

  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd),
  //     takeUntilDestroyed(this.destroyRef)
  //   ).subscribe(() => this.refreshUnread());
  // }

  // logout(): void {
  //   this.auth.logout();
  //   this.bookingState.clear();
  //   this.notifications.clear();
  //   void this.router.navigate(['/login']);
  // }

  // private refreshUnread(): void {
  //   const user = this.auth.user();
  //   if (user?.role === 'Customer') {
  //     this.notifications.getForCustomer(user.userId).subscribe({ error: () => undefined });
  //   }
  // }
}
}
