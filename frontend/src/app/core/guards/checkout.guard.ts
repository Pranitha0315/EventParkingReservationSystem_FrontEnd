// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { BookingStateService } from '../services/booking-state.service';

// export const checkoutGuard: CanActivateFn = () => {
//   const state = inject(BookingStateService);
//   const router = inject(Router);
//   const eventId = state.event()?.eventId;
//   if (state.seatCount() > 0) return true;
//   return router.createUrlTree(eventId ? ['/events', eventId, 'seats'] : ['/events']);
// };
