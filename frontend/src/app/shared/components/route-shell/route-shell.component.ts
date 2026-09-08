import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({ selector: 'app-route-shell', standalone: true, imports: [RouterOutlet], template: `<router-outlet />` })
export class RouteShellComponent {}
