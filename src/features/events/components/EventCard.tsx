import React from 'react';
import Link from 'next/link';
import { Event } from '../types';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';

interface EventCardProps {
    event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
    const dateObj = new Date(event.startDate);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);

    const isLowStock = event.availableTickets > 0 && event.availableTickets < 10;
    const isSoldOut = event.availableTickets === 0;

    return (
        <Link href={`/events/${event.id}`} className="block h-full group">
            <Card className="h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] border-white/5 hover:border-primary-500/30">
                <div className="aspect-[16/10] bg-neutral-800 relative overflow-hidden">
                    {event.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-700">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 right-4 z-20">
                        <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                            <div className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-emerald-500'} animate-pulse`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                                {isSoldOut ? 'Épuisé' : isLowStock ? 'Dernières places' : 'Disponible'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">
                            {formattedDate}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                            {event.title}
                        </h3>
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            {event.location}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-500 uppercase">À partir de</span>
                            <span className="font-bold text-white text-lg">
                                {new Intl.NumberFormat('fr-FR').format(event.price)} <span className="text-xs text-neutral-400 font-normal">{event.currency}</span>
                            </span>
                        </div>
                        <Button variant="glass" size="sm" className="group-hover:bg-primary-500 group-hover:border-primary-400 transition-all">
                            Réserver
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
};
