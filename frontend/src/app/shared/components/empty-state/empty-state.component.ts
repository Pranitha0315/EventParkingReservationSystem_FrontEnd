import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<div class="empty-state"><div class="empty-icon">◇</div><h3>{{ title }}</h3><p>{{ message }}</p></div>`
})

export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'There is no data to display.';
}
