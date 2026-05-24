import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '../types';
import { Button } from '@/shared/components/ui/Button';

interface EventCardProps {
    event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
    const startDateObj = new Date(event.startDate);
    const endDateObj = event.endDate ? new Date(event.endDate) : null;
    
    const dayMonthFormatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
    });

    const fullFormatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedStartDate = dayMonthFormatter.format(startDateObj);
    
    let displayDate = "";
    if (endDateObj) {
        const formattedEndDate = dayMonthFormatter.format(endDateObj);
        if (formattedStartDate === formattedEndDate) {
            displayDate = fullFormatter.format(startDateObj);
        } else {
            displayDate = `${formattedStartDate} - ${formattedEndDate}`;
        }
    } else {
        displayDate = fullFormatter.format(startDateObj);
    }

    const isLowStock = event.availableTickets > 0 && event.availableTickets < 10;
    const isSoldOut = event.availableTickets === 0;

    return (
        <Link href={`/events/${event.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-[2rem] group">
            <div className="glass-card h-full flex flex-col rounded-[2rem] overflow-hidden relative p-2">
                <div className="aspect-[4/3] bg-neutral-900 relative overflow-hidden rounded-3xl">
                    {event.imageUrl ? (
                        <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-600">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                    )}

                    {/* Étiquette Certifié */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="bg-accent-500/90 backdrop-blur-md text-white border border-accent-400/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(203,163,92,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Certifié
                            </span>
                        </div>
                    </div>


                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-[#050811]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-emerald-500'} animate-pulse`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                                {isSoldOut ? 'Épuisé' : isLowStock ? 'Dernières places' : 'Disponible'}
                            </span>
                        </div>
                        {event.vipPrice && (
                            <div className="bg-accent-900/80 backdrop-blur-md border border-accent-600/50 px-3 py-1.5 rounded-full mt-2 shadow-[0_0_10px_rgba(203,163,92,0.2)]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-400">
                                    VIP Disponible
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">
                                {displayDate}
                            </span>
                            {event.category && (
                                <span className="text-[9px] font-extrabold bg-primary-950/40 text-primary-300 border border-primary-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {event.category.name}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white transition-colors line-clamp-1">
                            {event.title}
                        </h3>
                        <p className="text-sm text-neutral-400 flex items-center gap-1 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span className="truncate">
                                {event.location}
                                {event.city && <span className="text-neutral-500 font-normal"> ({event.city.name})</span>}
                            </span>
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-400 uppercase font-medium">À partir de</span>
                            <span className="font-black text-white text-lg tracking-tight">
                                {new Intl.NumberFormat('fr-FR').format(event.price)} <span className="text-xs text-neutral-400 font-medium">{event.currency}</span>
                            </span>
                        </div>
                        <Button variant="primary" size="sm" className="rounded-xl transition-all">
                            Réserver
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
