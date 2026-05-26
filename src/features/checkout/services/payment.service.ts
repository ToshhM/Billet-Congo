import { Ticket, CheckoutSession } from '../../tickets/types';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

function sanitizePhoneNumber(phone: string): string {
    // Remove all spaces, dashes, +, and non-digits
    let cleaned = phone.replace(/[\s\-+]/g, '');
    
    // If it starts with 0 (e.g. 061234567), replace the leading 0 with 242 (Congo code)
    if (cleaned.startsWith('0')) {
        cleaned = '242' + cleaned.slice(1);
    }
    
    // If it's a 9 digit number starting with 5 or 6 (e.g. 61234567), prepend 242
    if (cleaned.length === 9 && (cleaned.startsWith('5') || cleaned.startsWith('6'))) {
        cleaned = '242' + cleaned;
    }
    
    return cleaned;
}

async function predictProvider(phoneNumber: string, defaultProvider: 'MTN' | 'AIRTEL'): Promise<string> {
    const sanitized = sanitizePhoneNumber(phoneNumber);
    try {
        const response = await fetch(`${process.env.PAWAPAY_API_BASE_URL}/v1/predict-correspondent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`
            },
            body: JSON.stringify({ msisdn: sanitized })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.correspondent) {
                return data.correspondent; // e.g. "MTN_CG" or "AIRTEL_CG"
            }
        } else {
            console.warn("Prediction returned status", response.status);
        }
    } catch (e) {
        console.error("Predict provider failed, falling back to manual mapping", e);
    }
    
    // Fallback manual mapping for Congo-Brazzaville
    return defaultProvider === 'MTN' ? 'MTN_CG' : 'AIRTEL_CG';
}

export const paymentService = {
    async initCheckout(eventId: string, userId: string, quantity: number, pricePerUnit: number, ticketType: string = 'STANDARD'): Promise<CheckoutSession> {
        const session = await prisma.order.create({
            data: {
                eventId,
                userId,
                quantity,
                totalPrice: quantity * pricePerUnit,
                ticketType,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 15 * 60000) // 15 mins
            }
        });
        return session as unknown as CheckoutSession;
    },

    async processMobileMoneyPayment(sessionId: string, phoneNumber: string, provider: 'MTN' | 'AIRTEL'): Promise<{ success: boolean; tickets?: Ticket[] }> {
        const order = await prisma.order.findUnique({
            where: { id: sessionId },
            include: { event: true }
        });

        if (!order || order.status === 'COMPLETED' || order.status === 'CANCELLED') {
            return { success: false };
        }

        const depositId = randomUUID();
        const pawaPayProvider = await predictProvider(phoneNumber, provider);
        const sanitizedPhone = sanitizePhoneNumber(phoneNumber);

        try {
            const response = await fetch(`${process.env.PAWAPAY_API_BASE_URL}/v2/deposits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`
                },
                body: JSON.stringify({
                    depositId,
                    amount: Math.round(order.totalPrice).toString(),
                    currency: order.event.currency || 'XAF',
                    payer: {
                        type: 'MMO',
                        accountDetails: {
                            phoneNumber: sanitizedPhone,
                            provider: pawaPayProvider
                        }
                    },
                    clientReferenceId: order.id,
                    customerMessage: "Billet Congo"
                })
            });

            if (response.ok) {
                // Create pending payment in database
                await prisma.payment.create({
                    data: {
                        orderId: order.id,
                        paymentMethod: provider,
                        transactionId: depositId,
                        amount: order.totalPrice,
                        status: 'PENDING'
                    }
                });

                // Log copy-pasteable PowerShell command in local console for developers to test securely
                console.log(`\n# ==================================================`);
                console.log(`# SIMULATION DU WEBHOOK LOCAL (POWERSHELL)`);
                console.log(`# Copie et colle ce bloc entier dans ton terminal PowerShell :`);
                console.log(`Invoke-RestMethod -Uri "http://localhost:3000/api/webhooks/pawapay" -Method Post -ContentType "application/json" -Body '{"depositId": "${depositId}", "status": "COMPLETED", "amount": "${Math.round(order.totalPrice)}", "currency": "${order.event.currency}", "country": "CG", "provider": "MTN_CG"}'`);
                console.log(`# ==================================================\n`);

                return { success: true };
            } else {
                const errData = await response.text();
                console.error("PawaPay API deposit rejected:", response.status, errData);
                
                // Mark order as cancelled
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'CANCELLED' }
                });

                return { success: false };
            }
        } catch (e) {
            console.error("PawaPay integration error:", e);
            return { success: false };
        }
    },

    async fulfillOrder(depositId: string): Promise<boolean> {
        // Find the payment record linked strictly to the depositId (transactionId)
        const payment = await prisma.payment.findUnique({
            where: { transactionId: depositId },
            include: { order: true }
        });
        
        if (!payment || payment.status === 'SUCCESS') {
            return false;
        }
        
        const order = payment.order;
        if (!order || order.status === 'COMPLETED') {
            return false;
        }
        
        try {
            await prisma.$transaction(async (tx) => {
                // 1. Mark order as COMPLETED
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: 'COMPLETED' }
                });
                
                // 2. Mark payment as SUCCESS
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS' }
                });
                
                // 3. Reduce available tickets on Event
                const isVip = order.ticketType === 'VIP';
                await tx.event.update({
                    where: { id: order.eventId },
                    data: {
                        [isVip ? 'availableVipTickets' : 'availableTickets']: {
                            decrement: order.quantity
                        }
                    }
                });
                
                // 4. Generate tickets
                const newTicketsData = Array.from({ length: order.quantity }).map((_, i) => ({
                    reference: `TKT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    eventId: order.eventId,
                    userId: order.userId,
                    orderId: order.id,
                    pricePaid: order.totalPrice / order.quantity,
                    type: order.ticketType,
                    status: 'VALID',
                    qrCodeData: `qr-payload-${order.eventId}-${order.userId}-${Date.now()}-${i}`
                }));
                
                await tx.ticket.createMany({
                    data: newTicketsData
                });
            });
            return true;
        } catch (e) {
            console.error("Order fulfillment error", e);
            return false;
        }
    },

    async failOrder(depositId: string): Promise<boolean> {
        const payment = await prisma.payment.findUnique({
            where: { transactionId: depositId },
            include: { order: true }
        });
        
        if (!payment || payment.status === 'FAILED') {
            return false;
        }
        
        const order = payment.order;
        
        try {
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' }
                });
                
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: 'CANCELLED' }
                });
            });
            return true;
        } catch (e) {
            console.error("Order failure handling error", e);
            return false;
        }
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
