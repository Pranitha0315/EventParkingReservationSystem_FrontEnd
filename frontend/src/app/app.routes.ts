import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { checkoutGuard } from './core/guards/checkout.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
]