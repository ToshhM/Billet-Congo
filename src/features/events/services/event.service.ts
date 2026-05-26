import { Event } from '../types';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const eventService = {
    async getEvents(params?: { q?: string; sort?: string; vip?: string; available?: string; city?: string; category?: string; }): Promise<Event[]> {
        try {
            const where: Prisma.EventWhereInput = { status: 'PUBLISHED' };

            if (params?.q) {
                const query = params.q;
                where.OR = [
                    { title: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ];
            }

            if (params?.available === '1') {
                where.availableTickets = { gt: 0 };
            }

            if (params?.vip === '1') {
                where.vipPrice = { not: null };
                where.availableVipTickets = { gt: 0 };
            }

            if (params?.city) {
                where.cityId = params.city;
            }

            if (params?.category) {
                where.categoryId = params.category;
            }

            let orderBy: Prisma.EventOrderByWithRelationInput = { startDate: 'asc' }; // Défaut : date la plus proche
            if (params?.sort) {
                switch (params.sort) {
                    case 'date-asc': orderBy = { startDate: 'asc' }; break;
                    case 'date-desc': orderBy = { startDate: 'desc' }; break;
                    case 'price-asc': orderBy = { price: 'asc' }; break;
                    case 'price-desc': orderBy = { price: 'desc' }; break;
                }
            }

            const events = await prisma.event.findMany({
                where,
                orderBy,
                include: { city: true, category: true }
            });
            
            return events.map(e => ({
                ...e,
                startDate: e.startDate.toISOString(),
                endDate: e.endDate?.toISOString(),
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
                orderBy: { createdAt: 'desc' },
                include: { city: true, category: true }
            });
            return events.map(e => ({
                ...e,
                startDate: e.startDate.toISOString(),
                endDate: e.endDate?.toISOString(),
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
                where: { id },
                include: { city: true, category: true }
            });
            if (!event) return null;

            return {
                ...event,
                startDate: event.startDate.toISOString(),
                endDate: event.endDate?.toISOString(),
                createdAt: event.createdAt.toISOString(),
                updatedAt: event.updatedAt.toISOString(),
            } as unknown as Event;
        } catch (error) {
            console.error(`Database connection error in getEventById(${id}):`, error);
            return null;
        }
    },

    async createEvent(eventData: Omit<Event, 'id' | 'availableTickets' | 'availableVipTickets'>): Promise<Event> {
        const event = await prisma.event.create({
            data: {
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                city: eventData.cityId ? { connect: { id: eventData.cityId } } : undefined,
                category: eventData.categoryId ? { connect: { id: eventData.categoryId } } : undefined,
                startDate: eventData.startDate ? new Date(eventData.startDate) : new Date(),
                endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
                price: eventData.price,
                vipPrice: eventData.vipPrice,
                capacity: eventData.capacity,
                availableTickets: eventData.capacity,
                vipCapacity: eventData.vipCapacity,
                availableVipTickets: eventData.vipCapacity,
                status: eventData.status,
                imageUrl: eventData.imageUrl,
                organizer: {
                    connect: { id: eventData.organizerId || 'usr-admin-1' }
                }
            }
        });
        return event as unknown as Event;
    },

    async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
        const dataToUpdate: Record<string, unknown> = { ...eventData } as Record<string, unknown>;
        if (dataToUpdate.id) delete dataToUpdate.id;
        if (dataToUpdate.organizerId) delete dataToUpdate.organizerId;
        if (dataToUpdate.startDate) dataToUpdate.startDate = new Date(dataToUpdate.startDate as string);
        
        if (dataToUpdate.endDate) {
            dataToUpdate.endDate = new Date(dataToUpdate.endDate as string);
        } else if (dataToUpdate.endDate === null) {
            dataToUpdate.endDate = null;
        }

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
