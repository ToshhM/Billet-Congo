import React from 'react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          CongoTickets
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            Événements
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            À propos
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            Se connecter
          </Link>
          <Link href="/auth?tab=register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
};
