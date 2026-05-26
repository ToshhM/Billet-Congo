'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/features/auth/server/auth.actions';
import { redirectToFirstEventCheckout } from '@/features/checkout/server/checkout.actions';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const registered = searchParams.get('registered');

        Promise.resolve().then(() => {
            if (errorParam === 'not_organizer') {
                setError("Désolé, vous n'êtes pas un organisateur. Veuillez vous connecter avec un compte approprié.");
            } else if (errorParam === 'not_authorized') {
                setError("Vous n'êtes pas autorisé à accéder à cette zone.");
            } else if (errorParam === 'not_scanner') {
                setError("Désolé, vous n'avez pas les droits d'accès au mode scanner.");
            }

            if (registered) {
                setSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
            }
        });
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData) as { error?: string, success?: boolean, role?: string };

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result.success) {
            const userRole = result.role?.toUpperCase();
            if (userRole === 'ADMIN') {
                router.push('/admin/dashboard');
            } else if (userRole === 'PROMOTER') {
                router.push('/organisateur/dashboard');
            } else if (userRole === 'SCANNER') {
                router.push('/scanner');
            } else {
                router.push('/account');
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 relative z-10">
            <Card className="w-full max-w-md p-8 border-none relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
                <div className="text-center mb-8 pt-4">
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white tracking-tight">Bon retour</h1>
                    <p className="text-neutral-400">Connectez-vous pour accéder à vos billets</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm">
                        {success}
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <Button type="submit" fullWidth size="lg" disabled={isLoading} className="mt-4">
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    <p className="text-center text-sm text-neutral-400 pt-4">
                        Pas encore de compte ?{' '}
                        <Link href="/auth/register" className="text-accent-500 hover:text-accent-400 font-medium">
                            S&apos;inscrire
                        </Link>
                    </p>

                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#111626] px-2 text-neutral-500 rounded-full">Ou</span>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        formAction={redirectToFirstEventCheckout}
                        variant="outline" 
                        fullWidth 
                        className="border-white/20 text-neutral-300 hover:bg-white/5 hover:border-white/30"
                    >
                        Continuer sans compte
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 relative z-10">
                <Card className="w-full max-w-md p-8 border-none text-center">
                    <p className="text-neutral-400 animate-pulse">Chargement...</p>
                </Card>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
