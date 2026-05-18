import { getEventById } from '@/features/events/services/event.service';
import { paymentService } from '@/features/checkout/services/payment.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { notFound } from 'next/navigation';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { processMobileMoneyPaymentAction, processGuestPaymentAction } from '@/features/checkout/server/checkout.actions';

interface PageProps {
    params: Promise<{ eventId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const user = await getCurrentUser();

    const event = await getEventById(resolvedParams.eventId);
    if (!event) notFound();

    const qtyParam = resolvedSearchParams.qty;
    const quantity = typeof qtyParam === 'string' ? parseInt(qtyParam, 10) : 1;
    const safeQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

    const ticketType = (resolvedSearchParams.type as string) || 'STANDARD';
    const isVip = ticketType === 'VIP';
    const pricePerUnit = isVip ? (event.vipPrice || event.price) : event.price;

    let session = null;
    let totalPrice = pricePerUnit * safeQuantity;

    if (user) {
        session = await paymentService.initCheckout(
            event.id,
            user.id,
            safeQuantity,
            pricePerUnit,
            ticketType
        );
        totalPrice = session.totalPrice;
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900">Finaliser la réservation</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Colonne gauche : Résumé */}
                <div className="md:col-span-1 border-b md:border-b-0 border-neutral-200 pb-8 md:pb-0 md:border-r pr-0 md:pr-8 mb-8 md:mb-0">
                    <h2 className="text-xl font-bold mb-6 text-neutral-900">Résumé de la commande</h2>

                    <div className="mb-6">
                        <h3 className="font-semibold text-lg text-neutral-900">{event.title}</h3>
                        <p className="text-sm text-neutral-600 capitalize">
                            {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(event.startDate))}
                        </p>
                        <p className="text-sm text-neutral-600">{event.location}</p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-neutral-200">
                        <div className="flex justify-between text-sm">
                            <span className={`${isVip ? 'text-amber-600 font-bold' : 'text-neutral-600'}`}>
                                Billet {isVip ? 'VIP' : 'Standard'} x {safeQuantity}
                            </span>
                            <span className="text-neutral-900">{new Intl.NumberFormat('fr-FR').format(pricePerUnit * safeQuantity)} {event.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Frais de service (0%)</span>
                            <span className="text-neutral-900">0 {event.currency}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-4 border-t border-neutral-200 mt-4 text-primary-600">
                            <span>Total à payer</span>
                            <span>{new Intl.NumberFormat('fr-FR').format(totalPrice)} {event.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Colonne droite : Paiement */}
                <div className="md:col-span-2">
                    <Card className="p-8 shadow-sm border border-neutral-200 bg-white">
                        <h2 className="text-xl font-bold mb-6 text-neutral-900 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Paiement Mobile Money
                        </h2>
                        <p className="text-sm text-neutral-600 mb-8">
                            Sélectionnez votre opérateur et entrez votre numéro. Vous recevrez un prompt USSD sur votre téléphone pour valider l&apos;achat.
                        </p>

                        <form action={user ? processMobileMoneyPaymentAction : processGuestPaymentAction} className="space-y-6">
                            {user ? (
                                <input type="hidden" name="sessionId" value={session!.id} />
                            ) : (
                                <>
                                     <input type="hidden" name="eventId" value={event.id} />
                                    <input type="hidden" name="quantity" value={safeQuantity} />
                                    <input type="hidden" name="type" value={ticketType} />
                                </>
                            )}

                            {!user && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-neutral-900 border-b border-neutral-200 pb-2">Vos informations</h3>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-neutral-700">Nom et Prénom</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            placeholder="Ex: John Doe"
                                            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-neutral-900 border-b border-neutral-200 pb-2">Opérateur de Mobile Money</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="cursor-pointer relative">
                                        <input type="radio" name="provider" value="MTN" className="peer sr-only" defaultChecked />
                                        <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center peer-checked:border-yellow-500 peer-checked:bg-yellow-50 shadow-sm transition-colors">
                                            <span className="font-bold text-yellow-500">MTN Mobile Money</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer relative">
                                        <input type="radio" name="provider" value="AIRTEL" className="peer sr-only" />
                                        <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center peer-checked:border-red-600 peer-checked:bg-red-50 shadow-sm transition-colors">
                                            <span className="font-bold text-red-600">Airtel Money</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-neutral-700">Numéro de Mobile Money</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={user?.phoneNumber || ''}
                                    required
                                    placeholder="Ex: 06 123 45 67"
                                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" fullWidth size="lg" className="h-14 text-lg">
                                    Payer {new Intl.NumberFormat('fr-FR').format(totalPrice)} {event.currency}
                                </Button>
                                <p className="text-center text-xs text-neutral-500 mt-4">
                                    En cliquant sur Payer, vous acceptez nos CGV.
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
