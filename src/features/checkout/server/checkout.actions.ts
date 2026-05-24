'use server';

import { paymentService } from '../services/payment.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { authService } from "@/features/auth/services/auth.service";
import { cookies } from 'next/headers';

export async function processMobileMoneyPaymentAction(formData: FormData): Promise<void> {
    const sessionId = formData.get('sessionId') as string;
    const phone = formData.get('phone') as string;
    const provider = formData.get('provider') as 'MTN' | 'AIRTEL';

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Vous devez être connecté.');
    }

    if (!phone || !provider) {
        throw new Error('Veuillez renseigner un numéro de téléphone valide.');
    }

    let redirectUrl = '';

    try {
        const response = await paymentService.processMobileMoneyPayment(sessionId, phone, provider);

        if (response.success && response.tickets && response.tickets.length > 0) {
            if (response.tickets.length === 1) {
                redirectUrl = `/account/ticket/${response.tickets[0].id}`;
            } else {
                redirectUrl = `/account?success=true`;
            }
        } else {
            throw new Error('Le paiement a échoué ou a expiré.');
        }
    } catch {
        throw new Error('Une erreur serveur est survenue.');
    }

    if (redirectUrl) {
        redirect(redirectUrl);
    }
}

export async function processGuestPaymentAction(formData: FormData): Promise<void> {
    const eventId = formData.get('eventId') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10) || 1;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const provider = formData.get('provider') as 'MTN' | 'AIRTEL';

    if (!fullName || !phone) throw new Error("Informations incomplètes.");

    const guestUser = await prisma.user.upsert({
        where: { phoneNumber: phone },
        update: { fullName },
        create: {
            role: 'GUEST',
            phoneNumber: phone,
            fullName,
            email: `guest_${Date.now()}@exemple.com`
        }
    });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    const ticketType = (formData.get('type') as string) || 'STANDARD';
    const priceToUse = ticketType === 'VIP' ? (event.vipPrice || event.price) : event.price;
    const session = await paymentService.initCheckout(eventId, guestUser.id, quantity, priceToUse, ticketType);

    let redirectUrl = '';

    try {
        const response = await paymentService.processMobileMoneyPayment(session.id, phone, provider);

        if (response.success && response.tickets && response.tickets.length > 0) {
            // Créer une session réelle pour le guest
            const { token } = await authService.createSession(guestUser as unknown as import('@/features/auth/types').User);
            const cookieStore = await cookies();
            cookieStore.set('congo_session', token, { 
                httpOnly: true, 
                maxAge: 60*60*24*7, 
                path: '/',
                sameSite: 'lax'
            });

            if (response.tickets.length === 1) {
                redirectUrl = `/account/ticket/${response.tickets[0].id}`;
            } else {
                redirectUrl = `/account?success=true`;
            }
        } else {
            throw new Error('Le paiement a échoué ou a expiré.');
        }
    } catch (err) {
        console.error("Erreur serveur", err);
        throw new Error('Une erreur serveur est survenue.');
    }

    if (redirectUrl) {
        redirect(redirectUrl);
    }
}

export async function redirectToFirstEventCheckout(): Promise<void> {
    const event = await prisma.event.findFirst({
        where: { status: 'PUBLISHED' },
        orderBy: { startDate: 'asc' }
    });
    
    if (event) {
        redirect(`/checkout/${event.id}?qty=1`);
    } else {
        redirect('/');
    }
}
