export interface VenueRequest { name: string; address: string; totalCapacity: number; }
export interface Venue extends VenueRequest { venueId: number; }
