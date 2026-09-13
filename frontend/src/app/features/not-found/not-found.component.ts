import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<section class="auth-shell"><div class="card auth-card"><h1>404</h1><p class="subhead">The page you requested does not exist.</p><a class="btn" routerLink="/">Go home</a></div></section>`
})
export class NotFoundComponent {}
