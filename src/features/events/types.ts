export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    location: string;
    cityId?: string | null;
    categoryId?: string | null;
    city?: { id: string; name: string } | null;
    category?: { id: string; name: string } | null;
    startDate: string; // ISO string
    endDate?: string;  // ISO string
    price: number;
    vipPrice?: number;
    currency: 'XAF'; // Franc CFA
    capacity: number;
    availableTickets: number;
    vipCapacity?: number;
    availableVipTickets?: number;
    status: EventStatus;
    organizerId: string;
}
