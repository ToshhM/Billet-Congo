'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type MobileMenuProps = {
  user: any;
};

export const MobileMenu = ({ user }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-300 hover:text-white transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-neutral-950/95 backdrop-blur-3xl animate-fade-in border-b border-white/10 z-50 shadow-2xl">
          <nav className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-neutral-200 hover:text-white transition-colors"
              >
                Événements
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-neutral-200 hover:text-white transition-colors"
              >
                À propos
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {user ? (
                <Link
                  href={user.role === 'ADMIN' ? "/admin/dashboard" : "/account"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-white">
                    {user.fullName?.charAt(0) || 'U'}
                  </span>
                  <span className="text-white font-medium">{user.role === 'ADMIN' ? 'Admin' : 'Mon Compte'}</span>
                </Link>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-center text-base font-medium text-white bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setIsOpen(false)}
                    className="text-center text-base font-medium bg-white text-black py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
