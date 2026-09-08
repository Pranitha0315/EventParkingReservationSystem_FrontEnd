export interface EventRequest {
  name: string;
  venueId: number;
  eventCategoryId: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  capacity: number;
  parkingFee: number;
}
export interface EventItem extends EventRequest {
  eventId: number;
  venueName: string;
  categoryName: string;
}
export interface EventFilters { name?: string; date?: string; venueId?: number; categoryId?: number; }
