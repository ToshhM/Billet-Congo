import { Event } from '../types';
import prisma from '@/lib/prisma';

export const eventService = {
    async getEvents(): Promise<Event[]> {
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
    },

    async getAdminEvents(): Promise<Event[]> {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return events.map(e => ({
            ...e,
            startDate: e.startDate.toISOString(),
            createdAt: e.createdAt.toISOString(),
            updatedAt: e.updatedAt.toISOString(),
        })) as unknown as Event[];
    },

    async getEventById(id: string): Promise<Event | null> {
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
                    connect: { id: eventData.organizerId || 'usr-admin-1' } // Fallback to admin if missing to prevent relation error in MVP
                }
            } as any
        });
        return event as unknown as Event;
    },

    async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
        // Prepare data to only include valid fields for update
        const dataToUpdate: any = { ...eventData };
        if (dataToUpdate.id) delete dataToUpdate.id;
        if (dataToUpdate.organizerId) delete dataToUpdate.organizerId;
        if (dataToUpdate.startDate) dataToUpdate.startDate = new Date(dataToUpdate.startDate);

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
