export type TicketStatus = 'PENDING' | 'PAID' | 'USED' | 'CANCELLED';

export interface Ticket {
    id: string;
    reference: string;
    eventId: string;
    userId: string;
    purchaseDate: string;
    pricePaid: number;
    status: TicketStatus;
    qrCodeData: string;
}

export interface CheckoutSession {
    id: string;
    eventId: string;
    userId: string;
    quantity: number;
    totalPrice: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    expiresAt: string;
}
