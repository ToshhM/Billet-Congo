import { getEvents } from '@/features/events/services/event.service';
import { EventCard } from '@/features/events/components/EventCard';
import { Button } from '@/shared/components/ui/Button';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const events = await getEvents();
  const user = await getCurrentUser();
  const organizeHref = user
    ? (user.role === 'CLIENT' ? '/auth/login?error=not_organizer' : '/admin/dashboard')
    : '/auth/login';

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section / Banner Slider */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="relative w-full h-[60vh] min-h-[500px] rounded-[3rem] overflow-hidden group shadow-[0_0_50px_-12px_rgba(109,59,255,0.2)] border border-white/5">
          {/* Temporary Placeholder Image for Slider */}
          <div className="absolute inset-0 bg-neutral-900">
            <Image 
              src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop" 
              alt="Concert" 
              fill
              priority
              className="object-cover opacity-50 mix-blend-screen transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/80 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-100 text-xs font-bold uppercase tracking-wider mb-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(109,59,255,0.8)]" />
                Événement à la une
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white animate-slide-up leading-tight">
                Vivez <span className="text-gradient">l&apos;instant.</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed animate-slide-up [animation-delay:0.1s] text-balance">
                La billetterie nouvelle génération pour le Congo. Découvrez, réservez et vibrez aux rythmes des meilleurs événements.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 animate-slide-up [animation-delay:0.2s]">
                <Button asChild size="lg" className="min-w-[200px] h-14 rounded-2xl text-base transition-all">
                  <Link href="/events">
                    Découvrir les événements
                  </Link>
                </Button>
                <Link href={organizeHref}>
                  <Button size="lg" variant="outline" className="min-w-[200px] h-14 rounded-2xl text-base transition-all">
                    Organiser un événement
                  </Button>
                </Link>
              </div>
            </div>

            {/* Slider Controls (Decorative for now) */}
            <div className="absolute bottom-8 right-8 flex gap-3 hidden md:flex">
              <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white hover:scale-105 active:scale-95">
                 ←
              </button>
              <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white hover:scale-105 active:scale-95">
                 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Feed */}
      <section className="pb-32 animate-fade-in [animation-delay:0.4s]">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-white">À l&apos;affiche</h2>
            <p className="text-neutral-400">Les événements incontournables du moment</p>
          </div>
          <Button asChild variant="ghost" className="text-primary-400 hover:text-primary-300 hover:bg-white/5">
            <Link href="/events">Voir tout le calendrier</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="animate-fade-in">
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-32 glass-card rounded-[2rem] flex flex-col items-center justify-center">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-6 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(109,59,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
            </div>
            <h3 className="text-xl font-heading font-bold mb-2 text-white">Aucun événement</h3>
            <p className="text-neutral-400">Revenez plus tard pour découvrir de nouvelles pépites.</p>
          </div>
        )}
      </section>
    </div>
  );
}
