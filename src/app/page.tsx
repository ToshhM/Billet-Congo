import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20">
      <section className="text-center max-w-3xl mx-auto mb-24 fade-in">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Vivez l'instant.
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
          <h2 className="text-2xl font-bold">À l'affiche</h2>
          <Button variant="ghost">Voir tout →</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Event Cards */}
          {[1, 2, 3].map((item) => (
            <Card key={item} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 bg-neutral-800" />
                {/* Fallback pattern for now */}
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">Concert</div>
                  <h3 className="text-xl font-bold">Showcase Fally Ipupa</h3>
                  <p className="text-sm text-neutral-300">Stade Marchand, Brazzaville</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-neutral-400">Dimanche 24 Mars • 18:00</div>
                  <div className="font-bold text-indigo-400">10 000 FCFA</div>
                </div>
                <Button fullWidth variant="secondary">Réserver</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
