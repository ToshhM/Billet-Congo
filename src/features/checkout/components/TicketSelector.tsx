'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';

interface TicketSelectorProps {
    eventId: string;
    price: number;
    vipPrice?: number;
    currency: string;
    availableTickets: number;
    availableVipTickets?: number;
}

export const TicketSelector = ({ 
    eventId, 
    price, 
    vipPrice, 
    currency, 
    availableTickets,
    availableVipTickets = 0
}: TicketSelectorProps) => {
    const [quantity, setQuantity] = useState(1);
    const [ticketType, setTicketType] = useState<'STANDARD' | 'VIP'>('STANDARD');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const currentPrice = ticketType === 'VIP' ? (vipPrice || 0) : price;
    const currentMax = ticketType === 'VIP' ? availableVipTickets : availableTickets;

    const handleIncrement = () => {
        if (quantity < Math.min(10, currentMax)) {
            setQuantity(q => q + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    const handleTypeChange = (type: 'STANDARD' | 'VIP') => {
        setTicketType(type);
        setQuantity(1); // On reset la quantité quand on change de type
    };

    const handleCheckout = () => {
        const typeParam = ticketType === 'VIP' ? '&type=VIP' : '';
        startTransition(() => {
            router.push(`/checkout/${eventId}?qty=${quantity}${typeParam}`);
        });
    };

    return (
        <div className="space-y-4">
            {vipPrice && (
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button
                        onClick={() => handleTypeChange('STANDARD')}
                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                            ticketType === 'STANDARD' 
                            ? 'glass text-white shadow-[0_0_15px_rgba(109,59,255,0.2)] border border-primary-500/30' 
                            : 'text-neutral-500 hover:text-white'
                        }`}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => handleTypeChange('VIP')}
                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                            ticketType === 'VIP' 
                            ? 'bg-accent-500/20 text-accent-500 shadow-[0_0_15px_rgba(203,163,92,0.2)] border border-accent-500/30' 
                            : 'text-neutral-500 hover:text-accent-500'
                        }`}
                    >
                        👑 VIP
                    </button>
                </div>
            )}

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-neutral-300">
                        Billet {ticketType === 'VIP' ? 'VIP' : 'Standard'}
                    </span>
                    <span className={`text-2xl font-bold ${ticketType === 'VIP' ? 'text-accent-500' : 'text-primary-400'}`}>
                        {new Intl.NumberFormat('fr-FR').format(currentPrice)} {currency}
                    </span>
                </div>

                <div className="mb-4 text-xs text-neutral-400">
                    {currentMax} places restantes
                </div>

                <div className="flex items-center justify-between mb-4 glass rounded-xl p-2 border border-white/10 shadow-sm">
                    <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-50 text-xl font-bold transition-colors text-white"
                    >
                        -
                    </button>
                    <span className="text-lg font-bold w-12 text-center text-white">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        disabled={quantity >= Math.min(10, currentMax)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-50 text-xl font-bold transition-colors text-white"
                    >
                        +
                    </button>
                </div>

                <div className="flex justify-between items-center text-sm mb-6 pt-4 border-t border-white/10">
                    <span className="text-neutral-300">Total :</span>
                    <span className="font-bold text-white text-lg">
                        {new Intl.NumberFormat('fr-FR').format(currentPrice * quantity)} {currency}
                    </span>
                </div>

                <Button 
                    fullWidth 
                    size="lg" 
                    className={`text-lg h-14 ${ticketType === 'VIP' ? 'bg-accent-500 hover:bg-accent-400 text-neutral-950 shadow-[0_0_20px_rgba(203,163,92,0.6)] border border-accent-400/50 font-extrabold' : ''}`} 
                    onClick={handleCheckout}
                    disabled={currentMax === 0 || isPending}
                >
                    {isPending ? 'Chargement...' : currentMax === 0 ? 'Complet' : 'Réserver maintenant'}
                </Button>
            </div>
        </div>
    );
};
