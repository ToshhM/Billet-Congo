import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-neutral-950 py-12 mt-20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="mb-4">
                        <Link href="/" className="flex items-center group w-fit">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-sm flex items-center justify-center shrink-0">
                                <Image 
                                    src="/logo.jpg" 
                                    alt="NyotaPass Logo" 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>
                        </Link>
                    </div>
                    <p className="text-sm text-neutral-400">
                        La première plateforme de billetterie fluide au Congo Brazzaville. Sécurisée, rapide, optimisée pour Mobile Money.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Liens Utiles</h4>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><Link href="/" className="hover:text-accent-500 transition-colors">Accueil</Link></li>
                        <li><Link href="/events" className="hover:text-accent-500 transition-colors">Tous les événements</Link></li>
                        <li><Link href="/events" className="hover:text-accent-500 transition-colors">Tarifs</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Légal</h4>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-accent-500 transition-colors">CGV / CGU</a></li>
                        <li><a href="#" className="hover:text-accent-500 transition-colors">Confidentialité</a></li>
                        <li><a href="#" className="hover:text-accent-500 transition-colors">Mentions Légales</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Nous Contacter</h4>
                    <p className="text-sm text-neutral-400">
                        Support WhatsApp: <br />+242 06 123 45 67
                    </p>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} NyotaPass. Tous droits réservés.
            </div>
        </footer>
    );
};
