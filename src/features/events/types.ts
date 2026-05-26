export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    location: string;
    cityId?: string | null;
    categoryId?: string | null;
    city?: { id: string; name: string } | null;
    category?: { id: string; name: string } | null;
    startDate: string; // ISO string
    endDate?: string | null;  // ISO string
    price: number;
    vipPrice?: number | null;
    currency: 'XAF'; // Franc CFA
    capacity: number;
    availableTickets: number;
    vipCapacity?: number | null;
    availableVipTickets?: number | null;
    status: EventStatus;
    organizerId: string;
}
