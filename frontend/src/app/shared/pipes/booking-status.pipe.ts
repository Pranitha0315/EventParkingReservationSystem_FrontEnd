import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bookingStatus', standalone: true })
export class BookingStatusPipe implements PipeTransform {
  transform(value: string): string {
    const labels: Record<string, string> = { Pending: 'Payment Pending', Confirmed: 'Confirmed', Cancelled: 'Cancelled', Expired: 'Expired' };
    return labels[value] ?? value;
  }
}
