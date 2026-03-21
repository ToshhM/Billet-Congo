import { getEvents } from '@/features/events/services/event.service';
import { EventCard } from '@/features/events/components/EventCard';
import { Button } from '@/shared/components/ui/Button';

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-600/20 rounded-full blur-[120px] -z-10 animate-float" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-accent-600/20 rounded-full blur-[120px] -z-10 animate-float [animation-delay:2s]" />

        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight animate-slide-up">
            Vivez <span className="text-gradient">l&apos;instant.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:0.1s] text-balance">
            La billetterie nouvelle génération pour le Congo. Découvrez, réservez et vibrez aux rythmes des meilleurs événements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:0.2s]">
            <Button size="lg" className="px-10 group min-w-[200px]">
              Découvrir
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">Organiser</Button>
          </div>
        </div>
      </section>

      {/* Events Feed */}
      <section className="pb-32 animate-fade-in [animation-delay:0.4s]">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">À l&apos;affiche</h2>
            <p className="text-neutral-500">Les événements incontournables du moment</p>
          </div>
          <Button variant="ghost" className="text-primary-400">Voir tout le calendrier</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="animate-fade-in">
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-32 glass-card rounded-[2rem]">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Aucun événement</h3>
            <p className="text-neutral-500">Revenez plus tard pour découvrir de nouvelles pépites.</p>
          </div>
        )}
      </section>
    </div>
  );
}
