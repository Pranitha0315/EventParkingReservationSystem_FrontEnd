import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `<article class="stat-card"><div class="stat-label">{{ label }}</div><div class="stat-value">{{ value }}</div><div class="stat-note">{{ note }}</div></article>`

})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() note = '';
}
