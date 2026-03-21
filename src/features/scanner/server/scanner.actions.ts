'use server';

import { scannerService } from '../services/scanner.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { revalidatePath } from 'next/cache';

export async function submitScanAction(reference: string) {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'SCANNER', 'PROMOTER'].includes(user.role)) {
        throw new Error('Non autorisé');
    }

    if (!reference || reference.trim() === '') {
        return { success: false, message: 'Référence vide.' };
    }

    const result = await scannerService.validateTicket(reference.trim(), user.id);
    revalidatePath('/scanner');
    return result;
}
