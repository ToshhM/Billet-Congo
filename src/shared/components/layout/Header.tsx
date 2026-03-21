import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { MobileMenu } from './MobileMenu';

export const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">
            CongoTickets
          </Link>
        </div>

        {/* Centered Navigation for Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Événements
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            À propos
          </Link>
        </nav>

        {/* Actions (Desktop Auth + Mobile Menu) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                href={user.role === 'ADMIN' ? "/admin/dashboard" : "/account"}
                className="text-sm font-medium glass text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold">
                  {user.fullName.charAt(0)}
                </span>
                <span>{user.role === 'ADMIN' ? 'Admin' : 'Mon Compte'}</span>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-neutral-200 transition-all font-semibold">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
};
