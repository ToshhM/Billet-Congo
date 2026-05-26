import { getEventById } from '@/features/events/services/event.service';
import { paymentService } from '@/features/checkout/services/payment.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { notFound } from 'next/navigation';
import { processMobileMoneyPaymentAction, processGuestPaymentAction } from '@/features/checkout/server/checkout.actions';
import PaymentForm from '@/features/checkout/components/PaymentForm';

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
        <div className="container mx-auto px-4 py-20 max-w-5xl animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-12 text-white tracking-tight">Finaliser la réservation</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

                {/* Colonne gauche : Résumé */}
                <div className="md:col-span-1 border-b md:border-b-0 border-white/10 pb-10 md:pb-0 md:border-r pr-0 md:pr-12 mb-10 md:mb-0">
                    <h2 className="text-xl font-bold mb-6 text-white">Résumé de la commande</h2>

                    <div className="mb-8">
                        <h3 className="font-extrabold text-lg text-white mb-2">{event.title}</h3>
                        <p className="text-sm text-neutral-400 capitalize mb-1">
                            {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(event.startDate))}
                        </p>
                        <p className="text-sm text-neutral-400">{event.location}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex justify-between text-sm">
                            <span className={`${isVip ? 'text-accent-400 font-extrabold' : 'text-neutral-300'}`}>
                                Billet {isVip ? '👑 VIP' : 'Standard'} x {safeQuantity}
                            </span>
                            <span className="text-white font-semibold">{new Intl.NumberFormat('fr-FR').format(pricePerUnit * safeQuantity)} {event.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Frais de service (0%)</span>
                            <span className="text-white font-semibold">0 {event.currency}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-6 border-t border-white/10 mt-6">
                            <span className="text-white">Total à payer</span>
                            <span className="text-accent-400 font-extrabold text-xl">{new Intl.NumberFormat('fr-FR').format(totalPrice)} {event.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Colonne droite : Paiement */}
                <div className="md:col-span-2 md:pl-4">
                    <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Glow effects for premium spatial feel */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

                        <h2 className="text-xl font-bold mb-3 text-white flex items-center gap-3 relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Paiement Mobile Money
                        </h2>
                        <p className="text-sm text-neutral-400 mb-8 leading-relaxed relative z-10">
                            Sélectionnez votre opérateur et entrez votre numéro. Vous recevrez une invitation à saisir votre code PIN sur votre téléphone pour valider l&apos;achat.
                        </p>

                        <PaymentForm
                            action={user ? processMobileMoneyPaymentAction : processGuestPaymentAction}
                            user={user}
                            session={session}
                            event={event}
                            ticketType={ticketType}
                            safeQuantity={safeQuantity}
                            totalPrice={totalPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
