import { Suspense } from 'react';
import { getEvents } from '@/features/events/services/event.service';
import { getCities } from '@/features/events/services/city.service';
import { getCategories } from '@/features/events/services/category.service';
import { EventCard } from '@/features/events/components/EventCard';
import { EventFilters } from '@/features/events/components/EventFilters';

type SearchParams = {
    q?: string;
    sort?: string;
    vip?: string;
    available?: string;
    city?: string;
    category?: string;
};

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const [events, cities, categories] = await Promise.all([
        getEvents(params),
        getCities(),
        getCategories(),
    ]);

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            {/* En-tête */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white">Tous les événements</h1>
                <p className="text-neutral-400 text-lg">Découvrez tous les événements à venir au Congo.</p>
            </div>

            {/* Filtres — wrappé dans Suspense car EventFilters utilise useSearchParams() */}
            <div className="mb-10">
                <Suspense fallback={
                    <div className="h-28 bg-neutral-900/50 rounded-2xl animate-pulse" />
                }>
                    <EventFilters total={events.length} cities={cities} categories={categories} />
                </Suspense>
            </div>

            {/* Grille des événements */}
            {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="animate-fade-in">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 glass-card rounded-[2rem]">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-500 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Aucun résultat</h3>
                    <p className="text-neutral-500">
                        {params.q
                            ? `Aucun événement pour "${params.q}". Essayez un autre terme.`
                            : 'Aucun événement ne correspond à vos filtres.'}
                    </p>
                </div>
            )}
        </div>
    );
}
