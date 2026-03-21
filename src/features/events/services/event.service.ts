import { Event } from '../types';
import prisma from '@/lib/prisma';

export const eventService = {
    async getEvents(): Promise<Event[]> {
        try {
            const events = await prisma.event.findMany({
                where: { status: 'PUBLISHED' },
                orderBy: { startDate: 'asc' }
            });
            
            return events.map(e => ({
                ...e,
                startDate: e.startDate.toISOString(),
                createdAt: e.createdAt.toISOString(),
                updatedAt: e.updatedAt.toISOString(),
            })) as unknown as Event[];
        } catch (error) {
            console.error('Database connection error in getEvents:', error);
            return [];
        }
    },

    async getAdminEvents(userId?: string, role?: string): Promise<Event[]> {
        try {
            const where = role === 'PROMOTER' ? { organizerId: userId } : {};
            const events = await prisma.event.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
            return events.map(e => ({
                ...e,
                startDate: e.startDate.toISOString(),
                createdAt: e.createdAt.toISOString(),
                updatedAt: e.updatedAt.toISOString(),
            })) as unknown as Event[];
        } catch (error) {
            console.error('Database connection error in getAdminEvents:', error);
            return [];
        }
    },

    async getDashboardStats(userId: string, role: string) {
        try {
            const whereEvent = role === 'PROMOTER' ? { organizerId: userId } : {};
            const events = await prisma.event.findMany({ 
                where: whereEvent,
                select: { id: true, status: true }
            });
            
            const eventIds = events.map(e => e.id);

            const orders = await prisma.order.findMany({
                where: {
                    eventId: { in: eventIds },
                    status: 'COMPLETED'
                },
                select: { totalPrice: true, quantity: true }
            });

            const totalRevenue = orders.reduce((sum: number, o: { totalPrice: number }) => sum + o.totalPrice, 0);
            const ticketsSold = orders.reduce((sum: number, o: { quantity: number }) => sum + o.quantity, 0);
            const activeEventsCount = events.filter(e => e.status === 'PUBLISHED').length;

            return { totalRevenue, ticketsSold, activeEventsCount };
        } catch (error) {
            console.error('Database connection error in getDashboardStats:', error);
            return { totalRevenue: 0, ticketsSold: 0, activeEventsCount: 0 };
        }
    },

    async getEventById(id: string): Promise<Event | null> {
        try {
            const event = await prisma.event.findUnique({
                where: { id }
            });
            if (!event) return null;

            return {
                ...event,
                startDate: event.startDate.toISOString(),
                createdAt: event.createdAt.toISOString(),
                updatedAt: event.updatedAt.toISOString(),
            } as unknown as Event;
        } catch (error) {
            console.error(`Database connection error in getEventById(${id}):`, error);
            return null;
        }
    },

    async createEvent(eventData: Omit<Event, 'id' | 'availableTickets'>): Promise<Event> {
        const event = await prisma.event.create({
            data: {
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                startDate: eventData.startDate ? new Date(eventData.startDate) : new Date(),
                price: eventData.price,
                capacity: eventData.capacity,
                availableTickets: eventData.capacity,
                status: eventData.status,
                imageUrl: eventData.imageUrl,
                organizer: {
                    connect: { id: eventData.organizerId || 'usr-admin-1' } // Toujours le lier à un vrai utilisateur idéalement
                }
            } as any
        });
        return event as unknown as Event;
    },

    async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
        const dataToUpdate: Record<string, unknown> = { ...eventData as any };
        if (dataToUpdate.id) delete dataToUpdate.id;
        if (dataToUpdate.organizerId) delete dataToUpdate.organizerId;
        if (dataToUpdate.startDate) dataToUpdate.startDate = new Date(dataToUpdate.startDate as string);

        const event = await prisma.event.update({
            where: { id },
            data: dataToUpdate
        });
        return event as unknown as Event;
    },

    async deleteEvent(id: string): Promise<boolean> {
        try {
            await prisma.event.delete({
                where: { id }
            });
            return true;
        } catch (e) {
            console.error('Delete event error:', e);
            return false;
        }
    }
};

export const getEvents = eventService.getEvents;
export const getEventById = eventService.getEventById;
