export interface CreateBookingRequest { eventId: number; seatIds: number[]; parkingSlotId: number | null; }
export interface BookingSeat { seatId: number; seatNumber: string; price: number; }
export interface ParkingReservation { parkingSlotId: number; slotNumber: string; fee: number; }
export interface Booking {
  bookingId: number;
  bookingNumber: string;
  customerId: number;
  eventId: number;
  eventName: string;
  status: string;
  totalAmount: number;
  holdExpiresAtUtc: string | null;
  seats: BookingSeat[];
  parking: ParkingReservation | null;
  createdAtUtc: string;
}
export interface HoldStatus {
  bookingId: number;
  status: string;
  holdExpiresAtUtc: string | null;
  remainingSeconds: number;
  isExpired: boolean;
}
