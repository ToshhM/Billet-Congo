import React from 'react';
import { getCurrentUser, adminUpdateUserAction } from '@/features/auth/server/auth.actions';
import { authService } from '@/features/auth/services/auth.service';
import { redirect, notFound } from 'next/navigation';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const currentUser = await getCurrentUser();
    const { id } = await params;

    if (!currentUser || currentUser.role !== 'ADMIN') {
        redirect('/auth/login');
    }

    const users = await authService.getUsers();
    const userToEdit = users.find(u => u.id === id);

    if (!userToEdit) {
        notFound();
    }

    return (
        <div className="p-8 md:p-12 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/users" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    ← Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold mt-4 text-neutral-900">Modifier l&apos;utilisateur</h1>
            </div>

            <Card className="p-8 border-none relative overflow-hidden">
                <form 
                    action={async (formData) => {
                        'use server';
                        const result = await adminUpdateUserAction(formData);
                        if (result?.success) {
                            redirect('/admin/users');
                        }
                    }} 
                    className="space-y-6"
                >
                    <input type="hidden" name="id" value={userToEdit.id} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Nom complet</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                defaultValue={userToEdit.fullName}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Rôle</label>
                            <select
                                name="role"
                                required
                                defaultValue={userToEdit.role}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            >
                                <option value="PROMOTER">Organisateur (PROMOTER)</option>
                                <option value="SCANNER">Scanner (Entrée)</option>
                                <option value="ADMIN">Administrateur</option>
                                <option value="CLIENT">Client</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                defaultValue={userToEdit.email}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                defaultValue={userToEdit.phoneNumber}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Mot de passe (laisser vide pour ne pas changer)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Link href="/admin/users" className="flex-1">
                            <Button variant="outline" fullWidth type="button">Annuler</Button>
                        </Link>
                        <Button type="submit" className="flex-[2]">Enregistrer les modifications</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
