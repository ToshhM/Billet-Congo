import React from 'react';

export const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-neutral-950 py-12 mt-20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        CongoTickets
                    </h3>
                    <p className="text-sm text-neutral-400">
                        La première plateforme de billetterie fluide au Congo Brazzaville. Sécurisée, rapide, optimisée pour Mobile Money.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Liens Utiles</h4>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">Accueil</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Tous les événements</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Légal</h4>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">CGV / CGU</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
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
                &copy; {new Date().getFullYear()} CongoTickets. Tous droits réservés.
            </div>
        </footer>
    );
};
