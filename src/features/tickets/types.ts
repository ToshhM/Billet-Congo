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
    type: 'STANDARD' | 'VIP';
    downloadCount: number;
}

export interface CheckoutSession {
    id: string;
    eventId: string;
    userId: string;
    quantity: number;
    totalPrice: number;
    ticketType: 'STANDARD' | 'VIP';
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    expiresAt: string;
}
