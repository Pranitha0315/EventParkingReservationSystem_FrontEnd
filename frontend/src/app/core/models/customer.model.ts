export interface RegisterCustomerRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export interface UpdateCustomerRequest { name: string; phone: string; }
export interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  emailVerified: boolean;
  bookingCount: number;
  createdAtUtc: string;
}
