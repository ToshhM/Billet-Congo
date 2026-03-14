import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/server/auth.actions';

export const Header = async () => {
  const user = await getCurrentUser();

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
          {user ? (
            <Link
              href={user.role === 'ADMIN' ? "/admin/dashboard" : "/account"}
              className="text-sm font-medium bg-neutral-800 border border-white/10 text-white px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                {user.fullName.charAt(0)}
              </span>
              <span>Espace {user.role === 'ADMIN' ? 'Admin' : 'Client'}</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                Se connecter
              </Link>
              <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
