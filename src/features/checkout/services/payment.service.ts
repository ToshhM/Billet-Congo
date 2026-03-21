import { Ticket, CheckoutSession } from '../../tickets/types';
import prisma from '@/lib/prisma';

export const paymentService = {
    async initCheckout(eventId: string, userId: string, quantity: number, pricePerUnit: number): Promise<CheckoutSession> {
        const session = await prisma.order.create({
            data: {
                eventId,
                userId,
                quantity,
                totalPrice: quantity * pricePerUnit,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 15 * 60000) // 15 mins
            }
        });
        return session as unknown as CheckoutSession;
    },

    async processMobileMoneyPayment(sessionId: string, phoneNumber: string, provider: 'MTN' | 'AIRTEL'): Promise<{ success: boolean; tickets?: Ticket[] }> {
        // Mock délai Mobile Money
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                const order = await prisma.order.findUnique({ where: { id: sessionId } });

                if (!order || order.status === 'COMPLETED') {
                    return resolve({ success: false });
                }

                try {
                    // Transaction Prisma pour mettre à jour et générer
                    const result = await prisma.$transaction(async (tx) => {
                        // 1. Mark session as completed
                        await tx.order.update({
                            where: { id: sessionId },
                            data: { status: 'COMPLETED' }
                        });

                        // 1.5 Create payment record
                        await tx.payment.create({
                            data: {
                                orderId: order.id,
                                paymentMethod: provider,
                                transactionId: `TXN-${provider}-${Date.now()}`,
                                amount: order.totalPrice,
                                status: 'SUCCESS'
                            }
                        });


                        // 2. Reduce available tickets on Event
                        await tx.event.update({
                            where: { id: order.eventId },
                            data: {
                                availableTickets: {
                                    decrement: order.quantity
                                }
                            }
                        });

                        // 3. Generate tickets
                        const newTicketsData = Array.from({ length: order.quantity }).map((_, i) => ({
                            reference: `TKT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                            eventId: order.eventId,
                            userId: order.userId,
                            orderId: order.id,
                            pricePaid: order.totalPrice / order.quantity,
                            status: 'VALID',
                            qrCodeData: `qr-payload-${order.eventId}-${order.userId}-${Date.now()}-${i}`
                        }));

                        await tx.ticket.createMany({
                            data: newTicketsData
                        });

                        // Fetching back the generated tickets to return them
                        const createdTickets = await tx.ticket.findMany({
                            where: {
                                orderId: order.id
                            },
                            orderBy: { createdAt: 'desc' }
                        });

                        return createdTickets;
                    });

                    resolve({ success: true, tickets: result as unknown as Ticket[] });
                } catch (e) {
                    console.error("Payment transaction error", e);
                    resolve({ success: false });
                }
            }, 2500); 
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
