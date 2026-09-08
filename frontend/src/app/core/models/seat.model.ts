export interface Seat {
  seatId: number;
  seatNumber: string;
  seatType: string | null;
  price: number;
  status: string;
}
export interface CreateSeatMapRequest { rows: number; columns: number; seatType?: string | null; seatPrice?: number | null; }
export interface UpdateSeatRequest { seatNumber: string; seatType?: string | null; seatPrice?: number | null; }
