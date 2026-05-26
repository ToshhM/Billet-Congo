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
        <div className="container mx-auto px-4 py-20 max-w-5xl animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-10 text-white tracking-tight">Finaliser la réservation</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Colonne gauche : Résumé */}
                <div className="md:col-span-1 border-b md:border-b-0 border-white/10 pb-8 md:pb-0 md:border-r pr-0 md:pr-10 mb-8 md:mb-0">
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
                <div className="md:col-span-2">
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

                        <form action={user ? processMobileMoneyPaymentAction : processGuestPaymentAction} className="space-y-6 relative z-10">
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
                                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Vos informations</h3>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Nom et Prénom</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            placeholder="Ex: John Doe"
                                            className="w-full bg-neutral-950/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-inner transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Opérateur de Mobile Money</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="cursor-pointer relative group">
                                        <input type="radio" name="provider" value="MTN" className="peer sr-only" defaultChecked />
                                        <div className="bg-neutral-950/30 border border-white/10 rounded-2xl p-5 text-center peer-checked:border-yellow-500/80 peer-checked:bg-yellow-500/10 peer-checked:shadow-[0_0_20px_-3px_rgba(234,179,8,0.2)] hover:bg-neutral-950/50 hover:border-white/20 transition-all duration-300">
                                            {/* MTN MoMo Premium Logo SVG */}
                                            <svg viewBox="0 0 120 40" className="h-8 w-auto mx-auto select-none">
                                                <rect width="120" height="40" rx="8" fill="#FFCC00" />
                                                <ellipse cx="38" cy="20" rx="20" ry="11" fill="none" stroke="#000" strokeWidth="2" />
                                                <text x="38" y="23" fontFamily="var(--font-sans), sans-serif" fontSize="9" fontWeight="900" fill="#000" textAnchor="middle">MTN</text>
                                                <text x="82" y="25" fontFamily="var(--font-sans), sans-serif" fontSize="11" fontWeight="bold" fill="#000" textAnchor="middle">MoMo</text>
                                            </svg>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer relative group">
                                        <input type="radio" name="provider" value="AIRTEL" className="peer sr-only" />
                                        <div className="bg-neutral-950/30 border border-white/10 rounded-2xl p-5 text-center peer-checked:border-red-600/80 peer-checked:bg-red-600/10 peer-checked:shadow-[0_0_20px_-3px_rgba(220,38,38,0.2)] hover:bg-neutral-950/50 hover:border-white/20 transition-all duration-300">
                                            {/* Airtel Money Premium Logo SVG */}
                                            <svg viewBox="0 0 120 40" className="h-8 w-auto mx-auto select-none">
                                                <rect width="120" height="40" rx="8" fill="#E31837" />
                                                <circle cx="35" cy="20" r="10" fill="#FFF" />
                                                <path d="M 33 16 C 30 16, 28 19, 28 22 C 28 25, 30 27, 33 27 C 36 27, 38 25, 38 22 C 38 18, 35 16, 33 16 Z M 33 24 C 31 24, 30 23, 30 21.5 C 30 20, 31 19, 33 19 C 34.5 19, 35.5 20, 35.5 21.5 C 35.5 23, 34.5 24, 33 24 Z" fill="#E31837" />
                                                <text x="78" y="24" fontFamily="var(--font-sans), sans-serif" fontSize="11" fontWeight="bold" fill="#FFF" textAnchor="middle">airtel</text>
                                            </svg>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Numéro de Mobile Money</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={user?.phoneNumber || ''}
                                    required
                                    placeholder="Ex: 06 123 45 67"
                                    className="w-full bg-neutral-950/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" fullWidth size="lg" className="h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300">
                                    Payer {new Intl.NumberFormat('fr-FR').format(totalPrice)} {event.currency}
                                </Button>
                                <p className="text-center text-xs text-neutral-500 mt-4 leading-relaxed">
                                    En cliquant sur Payer, vous acceptez nos CGV.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
