import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink, HighlightDirective],
  template: ``
})
export class EventCardComponent {
}