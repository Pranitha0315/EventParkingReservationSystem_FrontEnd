import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { EventItem } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink, HighlightDirective],
  template: `<article class="card event-card v3-event-card" [class]="'card event-card v3-event-card ' + themeClass()" appHighlight>
      <div class="v3-event-card-visual">
        <div class="v3-event-card-object"><span>{{ icon() }}</span><i></i><i></i></div>
        <span class="event-category-chip">{{ event.categoryName }}</span>
        <small>{{ layoutLabel() }}</small>
      </div>
      <div class="v3-event-card-body">
        <div class="event-meta"><span>{{ event.eventDate }}</span><span>•</span><span>{{ event.startTime | slice:0:5 }}–{{ event.endTime | slice:0:5 }}</span></div>
        <h3>{{ event.name }}</h3>
        <p class="v3-event-venue">{{ event.venueName }}</p>
        <div class="v3-event-feature-row"><span>Seat selection</span><span>Parking {{ event.parkingFee > 0 ? 'available' : 'optional' }}</span></div>
        <div class="v3-event-card-footer">
          <div><small>FROM</small><strong>{{ event.ticketPrice | currency:'LKR':'symbol-narrow':'1.0-0' }}</strong></div>
          <a class="btn" [routerLink]="['/events', event.eventId]">View & reserve →</a>
        </div>
      </div>
    </article>`
})
export class EventCardComponent {
  @Input({ required: true }) event!: EventItem;

  icon(): string {
    const text = `${this.event.name} ${this.event.categoryName}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band|show|sing)/.test(text)) return '♫';
    if (/(sport|cricket|football|rugby|basket|match|game|tournament|stadium)/.test(text)) return '◉';
    if (/(conference|seminar|business|workshop|lecture)/.test(text)) return '◈';
    if (/(movie|cinema|theatre|theater|drama)/.test(text)) return '▶';
    return '✦';
  }

  themeClass(): string {
    const text = `${this.event.name} ${this.event.categoryName}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band|show|sing)/.test(text)) return 'event-theme-music';
    if (/(sport|cricket|football|rugby|basket|match|game|tournament|stadium)/.test(text)) return 'event-theme-sport';
    if (/(conference|seminar|business|workshop|lecture)/.test(text)) return 'event-theme-talk';
    return 'event-theme-default';
  }

  layoutLabel(): string {
    const text = `${this.event.name} ${this.event.categoryName}`.toLowerCase();
    if (/(music|concert|dj|festival|live|band|show|sing)/.test(text)) return 'Round concert layout';
    if (/(sport|cricket|football|rugby|basket|match|game|tournament|stadium)/.test(text)) return 'Stadium layout';
    if (/(conference|cinema|movie|theatre|theater|drama|seminar|workshop|business|lecture)/.test(text)) return 'Theatre layout';
    return 'Event hall layout';
  }
}