export interface PaymentSummary { bookingId: number; bookingNumber: string; amountDue: number; paid: boolean; bookingStatus: string; }
export interface Payment { paymentId: number; bookingId: number; amount: number; status: string; paidAtUtc: string; }
