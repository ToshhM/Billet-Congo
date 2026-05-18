'use server';

import { cookies } from 'next/headers';
import { authService } from '../services/auth.service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { User, UserRole } from '../types';

export async function registerAction(formData: FormData) {
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    if (!email || !phone || !password || !fullName) {
        return { error: 'Tous les champs sont requis.' };
    }

    try {
        await authService.register(email, phone, password, fullName);
        return { success: true };
    } catch (error) {
        const err = error as { code?: string };
        if (err.code === 'P2002') {
            return { error: 'Cet email ou numéro de téléphone est déjà utilisé.' };
        }
        return { error: 'Une erreur est survenue lors de l\'inscription.' };
    }
}

export async function adminCreateUserAction(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return { error: 'Action non autorisée.' };
    }

    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as UserRole;

    if (!email || !phone || !password || !fullName || !role) {
        return { error: 'Tous les champs sont requis.' };
    }

    try {
        await authService.register(email, phone, password, fullName, role);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        const err = error as { code?: string };
        if (err.code === 'P2002') {
            return { error: 'Cet email ou numéro de téléphone est déjà utilisé.' };
        }
        return { error: 'Une erreur est survenue.' };
    }
}

export async function adminUpdateUserAction(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return { error: 'Action non autorisée.' };
    }

    const id = formData.get('id') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as UserRole;
    const password = formData.get('password') as string;

    if (!id || !email || !phone || !fullName || !role) {
        return { error: 'Champs obligatoires manquants.' };
    }

    try {
        const data: Partial<User> & { password?: string } = { email, phoneNumber: phone, fullName, role };
        if (password && password.trim() !== '') {
            data.password = password;
        }
        await authService.updateUser(id, data);
        revalidatePath('/admin/users');
        return { success: true };
    } catch {
        return { error: 'Une erreur est survenue lors de la mise à jour.' };
    }
}

export async function adminDeleteUserAction(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return { error: 'Action non autorisée.' };
    }

    const id = formData.get('id') as string;
    if (!id) return { error: 'ID manquant.' };

    if (id === currentUser.id) {
        return { error: 'Vous ne pouvez pas supprimer votre propre compte.' };
    }

    try {
        await authService.deleteUser(id);
        revalidatePath('/admin/users');
        return { success: true };
    } catch {
        return { error: 'Une erreur est survenue lors de la suppression.' };
    }
}

export async function updateAccountAction(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Non authentifié' };

    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const fullName = formData.get('fullName') as string;
    const password = formData.get('password') as string;

    if (!email || !phone || !fullName) {
        return { error: 'Champs obligatoires manquants.' };
    }

    try {
        const data: Partial<User> & { password?: string } = { email, phoneNumber: phone, fullName };
        if (password && password.trim() !== '') {
            data.password = password;
        }
        await authService.updateUser(user.id, data);
        revalidatePath('/account');
        return { success: true };
    } catch {
        return { error: 'Une erreur est survenue lors de la mise à jour.' };
    }
}

export async function loginAction(formData: FormData) {
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    if (!phone || !password) {
        return { error: 'Numéro et mot de passe requis.' };
    }

    const session = await authService.authenticate(phone, password);

    if (!session) {
        return { error: 'Identifiants invalides.' };
    }

    // Stocker le token dans un cookie HTTP Only
    const cookieStore = await cookies();
    cookieStore.set('congo_session', session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
        path: '/',
    });

    return { success: true, role: session.user.role };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('congo_session');
    redirect('/auth/login');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('congo_session')?.value;

    if (!token) {
        return null;
    }

    const session = await authService.getSessionByToken(token);
    return session?.user || null;
}
