import { getEventById } from '@/features/events/services/event.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TicketSelector } from '@/features/checkout/components/TicketSelector';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const event = await getEventById(resolvedParams.id);

    if (!event) {
        return {
            title: 'Événement non trouvé | AstroPass',
        };
    }

    const description = event.description.length > 160 
        ? event.description.substring(0, 157) + '...' 
        : event.description;

    return {
        title: `${event.title} | AstroPass`,
        description: description,
        openGraph: {
            title: event.title,
            description: description,
            url: `https://astropass.com/events/${event.id}`,
            siteName: 'AstroPass',
            images: event.imageUrl ? [
                {
                    url: event.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: event.title,
                }
            ] : [],
            locale: 'fr_FR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: description,
            images: event.imageUrl ? [event.imageUrl] : [],
        },
    };
}

export default async function EventDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const event = await getEventById(resolvedParams.id);

    if (!event) {
        notFound();
    }

    const startDateObj = new Date(event.startDate);
    const endDateObj = event.endDate ? new Date(event.endDate) : null;

    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedStartDate = dateFormatter.format(startDateObj);
    const formattedEndDate = endDateObj ? dateFormatter.format(endDateObj) : null;

    return (
        <div className="min-h-screen bg-transparent">
            {/* Hero Section / Image de couverture */}
            <div className="relative h-[50vh] md:h-[75vh] w-full bg-neutral-900">
                {event.imageUrl && (
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover mix-blend-screen opacity-70"
                        priority
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/80 via-transparent to-transparent opacity-60" />

                <div className="absolute top-6 left-4 md:left-8 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all border border-white/10 shadow-[0_0_15px_rgba(109,59,255,0.2)]">
                        <span>←</span> Retour aux événements
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Infos gauche) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card rounded-3xl p-6 md:p-10">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="glass text-primary-100 border-primary-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-[0_0_10px_rgba(109,59,255,0.3)]">
                                    {event.status === 'PUBLISHED' ? 'En vente' : event.status}
                                </span>
                                <span className="bg-white/5 text-neutral-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                    Concert
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-tight text-white drop-shadow-lg">
                                {event.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center border-primary-500/30 shadow-[0_0_15px_rgba(109,59,255,0.2)]">
                                        <span className="text-xl">📅</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-neutral-400 font-medium mb-1">Date & Heure</div>
                                        <div className="font-semibold text-white capitalize text-balance">
                                            {formattedEndDate ? (
                                                <div className="flex flex-col">
                                                    <span>Du {formattedStartDate}</span>
                                                    <span className="text-primary-400">au {formattedEndDate}</span>
                                                </div>
                                            ) : (
                                                formattedStartDate
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center border-primary-500/30 shadow-[0_0_15px_rgba(109,59,255,0.2)]">
                                        <span className="text-xl">📍</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-neutral-400 font-medium mb-1">Lieu</div>
                                        <div className="font-semibold text-white">{event.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-heading font-bold mb-4 text-white">À propos de l&apos;événement</h2>
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
                        <div className="glass-card rounded-3xl p-6 sticky top-24 shadow-[0_0_30px_rgba(109,59,255,0.1)]">
                            <h3 className="text-xl font-heading font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(109,59,255,0.8)]" />
                                Réserver vos billets
                            </h3>

                            <TicketSelector
                                eventId={event.id}
                                price={event.price}
                                vipPrice={event.vipPrice || undefined}
                                currency={event.currency}
                                availableTickets={event.availableTickets}
                                availableVipTickets={event.availableVipTickets || undefined}
                            />

                            <p className="text-xs text-center text-neutral-400 mt-6">
                                Les paiements sont sécurisés. Vous recevrez vos e-tickets instantanément après le paiement via Mobile Money.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
