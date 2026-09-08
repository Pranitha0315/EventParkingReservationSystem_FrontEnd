import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingService } from '../../../core/services/parking.service';
import { EventService } from '../../../core/services/event.service';
import { BookingStateService } from '../../../core/services/booking-state.service';
import { ParkingSlot } from '../../../core/models/parking.model';
import { EventItem } from '../../../core/models/event.model';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SlotCodePipe } from '../../../shared/pipes/slot-code.pipe';

type ParkingZoneView = {
  name: string;
  available: number;
  total: number;
  left: ParkingSlot[];
  right: ParkingSlot[];
};

@Component({
  selector: 'app-parking-map',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, SlotCodePipe],
  templateUrl: './parking-map.component.html'
})
export class ParkingMapComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parkingService = inject(ParkingService);
  private readonly eventService = inject(EventService);
  readonly state = inject(BookingStateService);
  readonly slots = signal<ParkingSlot[]>([]);
  readonly event = signal<EventItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly activeZone = signal('All');
  eventId = 0;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ event: this.eventService.get(this.eventId), slots: this.parkingService.getLayout(this.eventId) }).subscribe({
      next: data => {
        this.event.set(data.event);
        this.state.setEvent(data.event);
        this.slots.set(data.slots);
        this.loading.set(false);
        const available = new Set(data.slots.filter(x => x.status === 'Available').map(x => x.parkingSlotId));
        this.state.clearParkingIfUnavailable(available);
      },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  // selected(slot: ParkingSlot): boolean {
  //   return this.state.parking()?.parkingSlotId === slot.parkingSlotId;
  // }

  // choose(slot: ParkingSlot): void {
  //   if (slot.status !== 'Available') return;
  //   this.state.setParking(this.selected(slot) ? null : slot);
  // }

  // continue(): void { void this.router.navigate(['/checkout']); }

  // skipParking(): void {
  //   this.state.setParking(null);
  //   this.continue();
  // }

  availableCount(): number {
    return this.slots().filter(slot => slot.status === 'Available').length;
  }

  unavailableCount(): number {
    return this.slots().length - this.availableCount();
  }

  zoneNames(): string[] {
    const zones = new Set(this.slots().map(slot => this.normalizedZone(slot)));
    return ['All', ...[...zones].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))];
  }

  setZone(zone: string): void { this.activeZone.set(zone); }

  zoneViews(): ParkingZoneView[] {
    const grouped = new Map<string, ParkingSlot[]>();
    for (const slot of this.slots()) {
      const zone = this.normalizedZone(slot);
      if (!grouped.has(zone)) grouped.set(zone, []);
      grouped.get(zone)!.push(slot);
    }

    const selectedZone = this.activeZone();
    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .filter(([name]) => selectedZone === 'All' || name === selectedZone)
      .map(([name, zoneSlots]) => {
        const sorted = [...zoneSlots].sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true }));
        const middle = Math.ceil(sorted.length / 2);
        return {
          name,
          available: sorted.filter(slot => slot.status === 'Available').length,
          total: sorted.length,
          left: sorted.slice(0, middle),
          right: sorted.slice(middle)
        };
      });
  }

  chooseRecommended(): void {
    const visible = this.zoneViews().flatMap(zone => [...zone.left, ...zone.right]);
    const candidate = visible.find(slot => slot.status === 'Available') ?? this.slots().find(slot => slot.status === 'Available');
    if (candidate) this.state.setParking(candidate);
  }

  slotLabel(slot: ParkingSlot): string {
    return slot.zone ? `${slot.zone} ${slot.slotNumber}` : slot.slotNumber;
  }

  private normalizedZone(slot: ParkingSlot): string {
    const zone = slot.zone?.trim();
    return zone ? zone : 'General';
  }
}
