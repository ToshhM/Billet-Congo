import { Ticket } from '@/features/tickets/types';
import prisma from '@/lib/prisma';

export type ScanResult = {
    success: boolean;
    message: string;
    ticket?: Ticket;
};

export const scannerService = {
    async validateTicket(referenceOrQrCode: string): Promise<ScanResult> {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                try {
                    // On cherche le billet
                    const ticket = await prisma.ticket.findFirst({
                        where: {
                            OR: [
                                { reference: referenceOrQrCode },
                                { qrCodeData: referenceOrQrCode }
                            ]
                        }
                    });

                    if (!ticket) {
                        return resolve({ success: false, message: 'Billet introuvable ou faux billet.' });
                    }

                    if (ticket.status === 'USED') {
                        return resolve({ success: false, message: 'Ce billet a déjà été scanné et utilisé.', ticket: ticket as unknown as Ticket });
                    }

                    if (ticket.status === 'CANCELLED') {
                        return resolve({ success: false, message: 'Ce billet a été annulé.', ticket: ticket as unknown as Ticket });
                    }

                    if (ticket.status !== 'PAID') {
                        return resolve({ success: false, message: `Billet invalide (Statut: ${ticket.status})`, ticket: ticket as unknown as Ticket });
                    }

                    // Marquer comme utilisé
                    const updatedTicket = await prisma.ticket.update({
                        where: { id: ticket.id },
                        data: {
                            status: 'USED',
                            scannedAt: new Date()
                        }
                    });

                    return resolve({
                        success: true,
                        message: 'Billet valide. Accès autorisé.',
                        ticket: updatedTicket as unknown as Ticket
                    });

                } catch (e) {
                    console.error("Erreur de scan", e);
                    return resolve({ success: false, message: 'Erreur interne du serveur lors du scan.' });
                }
            }, 600); // UI feel delay
        });
    }
};
