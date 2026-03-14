import { getEventById } from '@/features/events/services/event.service';
import { notFound } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { TicketSelector } from '@/features/checkout/components/TicketSelector';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const event = await getEventById(resolvedParams.id);

    if (!event) {
        notFound();
    }

    const dateObj = new Date(event.startDate);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);

    return (
        <div className="min-h-screen bg-neutral-950">
            {/* Hero Section / Image de couverture */}
            <div className="relative h-[40vh] md:h-[60vh] w-full bg-neutral-900 border-b border-white/10">
                {event.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                <div className="absolute top-6 left-4 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-sm font-medium hover:bg-black/70 transition-colors border border-white/10">
                        <span>←</span> Retour aux événements
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Infos gauche) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                    {event.status === 'PUBLISHED' ? 'En vente' : event.status}
                                </span>
                                <span className="bg-white/10 text-neutral-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                    Concert
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <span className="text-xl">📅</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-neutral-400 font-medium mb-1">Date & Heure</div>
                                        <div className="font-semibold text-white capitalize">{formattedDate}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                        <span className="text-xl">📍</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-neutral-400 font-medium mb-1">Lieu</div>
                                        <div className="font-semibold text-white">{event.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">À propos de l&apos;événement</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-neutral-300 leading-relaxed text-lg text-balance">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Ticket card) */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Réserver vos billets</h3>

                            <div className="mb-4 text-sm text-emerald-400 font-medium">
                                {event.availableTickets} billets disponibles
                            </div>

                            <TicketSelector
                                eventId={event.id}
                                price={event.price}
                                currency={event.currency}
                                availableTickets={event.availableTickets}
                            />

                            <p className="text-xs text-center text-neutral-500 mt-4">
                                Les paiements sont sécurisés. Vous recevrez vos e-tickets instantanément après le paiement via Mobile Money.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
