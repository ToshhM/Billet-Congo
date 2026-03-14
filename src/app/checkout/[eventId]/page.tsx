import { getEventById } from '@/features/events/services/event.service';
import { paymentService } from '@/features/checkout/services/payment.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { notFound, redirect } from 'next/navigation';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { processMobileMoneyPaymentAction } from '@/features/checkout/server/checkout.actions';

interface PageProps {
    params: Promise<{ eventId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const user = await getCurrentUser();

    if (!user) {
        redirect(`/login?callbackUrl=/checkout/${resolvedParams.eventId}`);
    }

    const event = await getEventById(resolvedParams.eventId);
    if (!event) notFound();

    const qtyParam = resolvedSearchParams.qty;
    const quantity = typeof qtyParam === 'string' ? parseInt(qtyParam, 10) : 1;
    const safeQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

    // Créer une session de checkout
    const session = await paymentService.initCheckout(
        event.id,
        user.id,
        safeQuantity,
        event.price
    );

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Finaliser la réservation</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Colonne gauche : Résumé */}
                <div className="md:col-span-1 border-r border-white/5 pr-0 md:pr-8">
                    <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

                    <div className="mb-6">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-neutral-400 capitalize">
                            {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(event.startDate))}
                        </p>
                        <p className="text-sm text-neutral-400">{event.location}</p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/10">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Billet Standard x {safeQuantity}</span>
                            <span>{new Intl.NumberFormat('fr-FR').format(event.price * safeQuantity)} {event.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Frais de service (0%)</span>
                            <span>0 {event.currency}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10 mt-4 text-indigo-400">
                            <span>Total à payer</span>
                            <span>{new Intl.NumberFormat('fr-FR').format(session.totalPrice)} {event.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Colonne droite : Paiement */}
                <div className="md:col-span-2">
                    <Card className="p-8 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Paiement Mobile Money</h2>
                        <p className="text-sm text-neutral-400 mb-8">
                            Sélectionnez votre opérateur et entrez votre numéro. Vous recevrez un prompt USSD sur votre téléphone pour valider l&apos;achat.
                        </p>

                        <form action={processMobileMoneyPaymentAction} className="space-y-6">
                            <input type="hidden" name="sessionId" value={session.id} />

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-neutral-300">Opérateur de Mobile Money</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="cursor-pointer relative">
                                        <input type="radio" name="provider" value="MTN" className="peer sr-only" defaultChecked />
                                        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 text-center peer-checked:border-yellow-400 peer-checked:bg-yellow-400/10 transition-colors">
                                            <span className="font-bold text-yellow-400">MTN Mobile Money</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer relative">
                                        <input type="radio" name="provider" value="AIRTEL" className="peer sr-only" />
                                        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 text-center peer-checked:border-red-500 peer-checked:bg-red-500/10 transition-colors">
                                            <span className="font-bold text-red-500">Airtel Money</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-neutral-300">Numéro de Mobile Money</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={user.phoneNumber}
                                    required
                                    placeholder="Ex: 06 123 45 67"
                                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" fullWidth size="lg" className="h-14 text-lg">
                                    Payer {new Intl.NumberFormat('fr-FR').format(session.totalPrice)} {event.currency}
                                </Button>
                                <p className="text-center text-xs text-neutral-500 mt-4">
                                    En cliquant sur Payer, vous acceptez nos CGV. Ce MVP simulera une attente de validation USSD puis réussira automatiquement.
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
