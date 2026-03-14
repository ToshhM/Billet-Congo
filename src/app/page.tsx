import { getEvents } from '@/features/events/services/event.service';
import { EventCard } from '@/features/events/components/EventCard';
import { Button } from '@/shared/components/ui/Button';

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-20">
      <section className="text-center max-w-3xl mx-auto mb-24 fade-in">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Vivez l&apos;instant.
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 mb-10 text-balance">
          Découvrez les meilleurs événements au Congo Brazzaville. Réservez vos places en un instant et payez facilement via MTN et Airtel Money.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="px-10">Parcourir les événements</Button>
          <Button size="lg" variant="outline">Créer un événement</Button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">À l&apos;affiche</h2>
          <Button variant="ghost">Voir tout →</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5">
            <p className="text-neutral-400">Aucun événement disponible pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
