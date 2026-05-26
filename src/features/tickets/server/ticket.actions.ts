'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/server/auth.actions';

export async function incrementDownloadCountAction(ticketId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Non autorisé");

    await prisma.ticket.update({
        where: { id: ticketId },
        data: { downloadCount: { increment: 1 } }
    });
}
