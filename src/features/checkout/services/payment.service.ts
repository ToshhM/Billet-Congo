import { Ticket, CheckoutSession } from '../../tickets/types';
import prisma from '@/lib/prisma';

export const paymentService = {
    async initCheckout(eventId: string, userId: string, quantity: number, pricePerUnit: number): Promise<CheckoutSession> {
        const session = await prisma.checkout.create({
            data: {
                eventId,
                userId,
                quantity,
                totalPrice: quantity * pricePerUnit,
                status: 'AWAITING_PAYMENT',
                expiresAt: new Date(Date.now() + 15 * 60000) // 15 mins
            }
        });
        return session as unknown as CheckoutSession;
    },

    async processMobileMoneyPayment(sessionId: string, phoneNumber: string, provider: 'MTN' | 'AIRTEL'): Promise<{ success: boolean; tickets?: Ticket[] }> {
        // En vrai, on appellerait l'API. On mock le delay Mobile Money ici.
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                const session = await prisma.checkout.findUnique({ where: { id: sessionId } });

                if (!session || session.status === 'COMPLETED') {
                    return resolve({ success: false });
                }

                try {
                    // Transaction Prisma pour mettre à jour et générer
                    const result = await prisma.$transaction(async (tx) => {
                        // 1. Mark session as completed
                        const updatedSession = await tx.checkout.update({
                            where: { id: sessionId },
                            data: { status: 'COMPLETED' }
                        });

                        // 2. Reduce available tickets on Event
                        await tx.event.update({
                            where: { id: session.eventId },
                            data: {
                                availableTickets: {
                                    decrement: session.quantity
                                }
                            }
                        });

                        // 3. Generate tickets
                        const newTicketsData = Array.from({ length: session.quantity }).map((_, i) => ({
                            reference: `TKT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                            eventId: session.eventId,
                            userId: session.userId,
                            pricePaid: session.totalPrice / session.quantity,
                            status: 'PAID',
                            qrCodeData: `qr-payload-${session.eventId}-${session.userId}-${Date.now()}-${i}`
                        }));

                        await tx.ticket.createMany({
                            data: newTicketsData
                        });

                        // Fetching back the generated tickets to return them
                        const createdTickets = await tx.ticket.findMany({
                            where: {
                                eventId: session.eventId,
                                userId: session.userId,
                            },
                            orderBy: { createdAt: 'desc' },
                            take: session.quantity
                        });

                        return createdTickets;
                    });

                    resolve({ success: true, tickets: result as unknown as Ticket[] });
                } catch (e) {
                    console.error("Payment transaction error", e);
                    resolve({ success: false });
                }
            }, 2500); // 2.5s delay like the real prompt wait time
        });
    },

    async getUserTickets(userId: string): Promise<Ticket[]> {
        const tickets = await prisma.ticket.findMany({
            where: { userId },
            orderBy: { purchaseDate: 'desc' }
        });

        // Convertir les objets Date Prisma en string pour que Next.js puisse les sérialiser
        return tickets.map(t => ({
            ...t,
            purchaseDate: t.purchaseDate.toISOString(),
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
            scannedAt: t.scannedAt ? t.scannedAt.toISOString() : undefined,
        })) as unknown as Ticket[];
    }
};
