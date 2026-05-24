import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logoutAction } from '@/features/auth/server/auth.actions';
import { MobileMenu } from './MobileMenu';

export const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 mb-8 transition-all duration-300">
      <div className="mx-auto max-w-6xl h-16 glass rounded-full flex items-center justify-between px-6 shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 shadow-sm flex items-center justify-center shrink-0">
              <Image 
                src="/logo.png" 
                alt="NyotaPass Logo" 
                fill 
                className="object-contain p-1" 
                priority
              />
            </div>
          </Link>
        </div>

        {/* Centered Navigation for Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/events" className="text-sm font-medium text-neutral-300 hover:text-accent-500 transition-colors">
            Événements
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-300 hover:text-accent-500 transition-colors">
            À propos
          </Link>
        </nav>

        {/* Actions (Desktop Auth + Mobile Menu) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={
                    user.role.toUpperCase() === 'ADMIN' 
                      ? "/admin/dashboard" 
                      : user.role.toUpperCase() === 'PROMOTER'
                        ? "/organisateur/dashboard"
                        : user.role.toUpperCase() === 'SCANNER' 
                          ? "/scanner" 
                          : "/account"
                  }
                  className="text-sm font-medium bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.fullName.charAt(0)}
                  </span>
                  <span>
                    {user.role === 'ADMIN' ? 'Admin' : 
                     user.role === 'PROMOTER' ? 'Organisateur' : 
                     user.role === 'SCANNER' ? 'Scanner' : 'Mon Compte'}
                  </span>
                </Link>
                
                <form action={logoutAction}>
                  <button 
                    type="submit"
                    className="text-neutral-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
                    title="Déconnexion"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-neutral-300 hover:text-accent-500 transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="text-sm font-medium bg-accent-500 text-neutral-950 px-5 py-2 rounded-lg hover:bg-accent-400 transition-all shadow-[0_0_15px_rgba(203,163,92,0.4)]">
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
