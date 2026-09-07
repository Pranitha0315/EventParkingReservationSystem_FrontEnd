import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="'status-badge status-' + normalized">{{ status }}</span>`

})
export class StatusBadgeComponent {
  @Input() status = '';
  get normalized(): string { return this.status.toLowerCase().replace(/\s+/g, '-'); }
}
