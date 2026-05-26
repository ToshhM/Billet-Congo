'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/features/auth/server/auth.actions';

type MobileMenuProps = {
  user: { role: string; fullName: string } | null;
};

export const MobileMenu = ({ user }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-accent-500 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0B1020]/95 backdrop-blur-3xl animate-fade-in border-b border-white/10 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <nav className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
              <Link 
                href="/events" 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-neutral-300 hover:text-accent-500 transition-colors"
              >
                Événements
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-neutral-300 hover:text-accent-500 transition-colors"
              >
                À propos
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {user ? (
                <div className="flex flex-col gap-4">
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
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(109,59,255,0.4)]">
                      {user.fullName?.charAt(0) || 'U'}
                    </span>
                    <span className="text-white font-medium">
                      {user.role === 'ADMIN' ? 'Admin' : 
                       user.role === 'PROMOTER' ? 'Organisateur' : 
                       user.role === 'SCANNER' ? 'Scanner' : 'Mon Compte'}
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 py-3 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Déconnexion
                  </button>
                </div>
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
                    className="text-center text-base font-medium bg-accent-500 text-neutral-950 py-3 rounded-xl hover:bg-accent-400 transition-colors shadow-[0_0_15px_rgba(203,163,92,0.4)]"
                  >
                    S&apos;inscrire
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
