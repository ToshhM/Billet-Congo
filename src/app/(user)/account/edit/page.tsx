import React from 'react';
import { getCurrentUser, updateAccountAction } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function EditAccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <div className="container mx-auto px-4 py-20 max-w-2xl">
            <div className="mb-8">
                <Link href="/account" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    ← Retour à mon espace
                </Link>
                <h1 className="text-3xl font-heading font-bold mt-4 text-white">Modifier mon profil</h1>
            </div>

            <Card className="p-8 border-none relative overflow-hidden">
                <form 
                    action={async (formData) => {
                        'use server';
                        const result = await updateAccountAction(formData);
                        if (result?.success) {
                            redirect('/account');
                        }
                    }} 
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Nom complet</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                defaultValue={user.fullName}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                defaultValue={user.email}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Numéro de téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            defaultValue={user.phoneNumber}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Link href="/account" className="flex-1">
                            <Button variant="outline" fullWidth type="button">Annuler</Button>
                        </Link>
                        <Button type="submit" className="flex-[2]">Enregistrer les modifications</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
