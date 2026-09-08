export interface ParkingSlot {
  parkingSlotId: number;
  slotNumber: string;
  zone: string | null;
  status: string;
  fee: number;
}
export interface CreateParkingLayoutRequest { slotCount: number; prefix: string; zone?: string | null; fee: number; }
export interface UpdateParkingSlotRequest { slotNumber: string; zone?: string | null; eventParkingFee?: number | null; }
