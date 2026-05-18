import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';

export const metadata = {
  title: 'À propos | AstroPass',
  description: 'En savoir plus sur AstroPass, la plateforme de billetterie nouvelle génération.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="relative w-full rounded-[3rem] p-10 md:p-24 text-center max-w-5xl mx-auto overflow-hidden group shadow-[0_0_50px_-12px_rgba(109,59,255,0.2)] border border-white/5 bg-neutral-900/40 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/40 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white animate-slide-up leading-tight">
              À propos de <span className="text-gradient">AstroPass</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:0.1s] text-balance">
              La plateforme de billetterie de référence au Congo. Nous connectons les organisateurs et les passionnés pour créer des expériences inoubliables.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 animate-fade-in [animation-delay:0.4s]">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center max-w-6xl mx-auto">
          {/* Text Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">Notre Mission</h2>
              <p className="text-neutral-400 leading-relaxed">
                Démocratiser l'accès à la culture et au divertissement en offrant une solution de billetterie simple, sécurisée et transparente pour tous les événements, des concerts intimes aux grands festivals.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Nous fournissons aux organisateurs des outils puissants pour gérer leurs événements, tout en garantissant aux participants une expérience d'achat fluide et sans friction.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">Notre Vision</h2>
              <p className="text-neutral-400 leading-relaxed">
                Devenir l'écosystème central du divertissement en Afrique centrale, en innovant constamment pour repousser les limites de l'expérience événementielle numérique.
              </p>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="min-w-[200px] h-14 rounded-2xl text-base transition-all">
                <Link href="/events">
                  Découvrir nos événements
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Column */}
          <div className="relative h-full min-h-[400px]">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col justify-center items-center text-center space-y-6 border border-white/5 shadow-[0_0_30px_-10px_rgba(109,59,255,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_20px_rgba(109,59,255,0.3)] group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-heading font-bold text-white">L'Excellence</h3>
                <p className="text-neutral-400 text-base leading-relaxed">
                  Nous nous engageons à fournir le meilleur service possible, avec une plateforme robuste et un support client réactif pour chaque événement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
