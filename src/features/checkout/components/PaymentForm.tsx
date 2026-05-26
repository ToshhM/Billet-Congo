'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface PaymentFormProps {
    action: (formData: FormData) => Promise<void>;
    user: any;
    session: any;
    event: any;
    ticketType: string;
    safeQuantity: number;
    totalPrice: number;
}

export default function PaymentForm({
    action,
    user,
    session,
    event,
    ticketType,
    safeQuantity,
    totalPrice
}: PaymentFormProps) {
    const [selectedProvider, setSelectedProvider] = useState<'MTN' | 'AIRTEL'>('MTN');

    return (
        <form action={action} className="space-y-6 relative z-10">
            {user ? (
                <input type="hidden" name="sessionId" value={session?.id} />
            ) : (
                <>
                    <input type="hidden" name="eventId" value={event.id} />
                    <input type="hidden" name="quantity" value={safeQuantity} />
                    <input type="hidden" name="type" value={ticketType} />
                </>
            )}

            {!user && (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                        Vos informations
                    </h3>
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Nom et Prénom
                        </label>
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
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    Opérateur de Mobile Money
                </h3>
                
                {/* Hidden input to pass the selected provider value in the standard HTML form submission */}
                <input type="radio" name="provider" value={selectedProvider} checked readOnly className="sr-only" />

                <div className="grid grid-cols-2 gap-4">
                    {/* MTN Selector */}
                    <div
                        onClick={() => setSelectedProvider('MTN')}
                        className={`cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 flex items-center justify-center min-h-[72px] border ${
                            selectedProvider === 'MTN'
                                ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_-3px_rgba(234,179,8,0.25)]'
                                : 'bg-neutral-950/30 border-white/10 hover:bg-neutral-950/50 hover:border-white/20'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src="https://www.logo.wine/a/logo/MTN_Group/MTN_Group-Logo.wine.svg"
                                alt="MTN Mobile Money"
                                className="h-14 w-auto object-contain select-none filter drop-shadow-md -my-2"
                            />
                            <span className="text-[11px] font-bold tracking-wider text-yellow-500 uppercase">
                                Mobile Money
                            </span>
                        </div>
                    </div>

                    {/* Airtel Selector */}
                    <div
                        onClick={() => setSelectedProvider('AIRTEL')}
                        className={`cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 flex items-center justify-center min-h-[72px] border ${
                            selectedProvider === 'AIRTEL'
                                ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_-3px_rgba(239,68,68,0.25)]'
                                : 'bg-neutral-950/30 border-white/10 hover:bg-neutral-950/50 hover:border-white/20'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src="https://www.logo.wine/a/logo/Bharti_Airtel/Bharti_Airtel-Logo.wine.svg"
                                alt="Airtel Money"
                                className="h-14 w-auto object-contain select-none filter drop-shadow-md -my-2"
                            />
                            <span className="text-[11px] font-bold tracking-wider text-red-500 uppercase">
                                Airtel Money
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Numéro de Mobile Money
                </label>
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
                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    className="h-14 text-lg font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-300"
                >
                    Payer {new Intl.NumberFormat('fr-FR').format(totalPrice)} {event.currency}
                </Button>
                <p className="text-center text-xs text-neutral-500 mt-4 leading-relaxed">
                    En cliquant sur Payer, vous acceptez nos CGV.
                </p>
            </div>
        </form>
    );
}
