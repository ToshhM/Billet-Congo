'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/features/auth/server/auth.actions';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData) as { error?: string, success?: boolean, role?: string };

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result.success) {
            if (result.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/account');
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 px-4">
            <Card className="w-full max-w-md p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Bon retour</h1>
                    <p className="text-neutral-400">Connectez-vous pour accéder à vos billets</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Numéro de téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="Ex: 06 123 45 67"
                            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Code PIN (4 chiffres)</label>
                        <input
                            type="password"
                            name="pin"
                            required
                            maxLength={4}
                            placeholder="••••"
                            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <Button type="submit" fullWidth size="lg" disabled={isLoading} className="mt-4">
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    <p className="text-center text-sm text-neutral-400 pt-4">
                        Pas encore de compte ?{' '}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            S&apos;inscrire
                        </Link>
                    </p>

                    <div className="mt-8 pt-6 border-t border-white/5 text-xs text-neutral-500">
                        <p className="mb-2"><strong>Démos disponibles :</strong></p>
                        <p>Admin: phone <code>061234567</code>, pin <code>1234</code></p>
                        <p>User: n&apos;importe quel numéro et un pin à 4 chiffres créera un compte (Mock)</p>
                    </div>
                </form>
            </Card>
        </div>
    );
}
