import React from 'react';
import Link from 'next/link';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 px-4">
            <Card className="w-full max-w-md p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
                    <p className="text-neutral-400">Rejoignez CongoTickets en 2 clics</p>
                </div>

                <form action="/login" className="space-y-5">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/80 p-4 rounded-xl mb-6 text-sm">
                        En mode MVP, utilisez simplement la page de connexion : saisir n&apos;importe quel numéro non connu avec un PIN de 4 chiffres créera automatiquement un compte.
                    </div>

                    <Link href="/login" className="block">
                        <Button type="button" fullWidth size="lg" className="mt-4">
                            Aller vers la connexion
                        </Button>
                    </Link>
                </form>
            </Card>
        </div>
    );
}
