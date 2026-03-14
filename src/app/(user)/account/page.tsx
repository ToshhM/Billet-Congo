import { getCurrentUser, logoutAction } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { paymentService } from '@/features/checkout/services/payment.service';
import { eventService } from '@/features/events/services/event.service';
import Link from 'next/link';

export default async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const tickets = await paymentService.getUserTickets(user.id);
    const events = await eventService.getEvents();

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Mon Espace</h1>
                    <p className="text-neutral-400">Bienvenue, {user.fullName}</p>
                </div>
                <form action={logoutAction} className="mt-4 md:mt-0">
                    <Button variant="outline" size="sm" type="submit">Déconnexion</Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold">Mes Billets Achetés</h2>

                    {tickets.length === 0 ? (
                        <Card className="p-10 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed">
                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl mb-4 text-neutral-500">
                                🎟️
                            </div>
                            <h3 className="text-xl font-bold mb-2">Aucun billet pour le moment</h3>
                            <p className="text-neutral-400 mb-6 max-w-sm mx-auto">
                                Vous n&apos;avez pas encore acheté de billet. Parcourez les événements à venir et réservez votre place.
                            </p>
                            <Link href="/">
                                <Button>Découvrir les événements</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tickets.map((ticket) => {
                                const event = events.find(e => e.id === ticket.eventId);
                                return (
                                    <div key={ticket.id} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
                                        <Link href={`/account/ticket/${ticket.id}`} className="block relative">
                                            {/* Tag de statut caché ou non, on met juste Payé */}
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 pb-1.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                    Valide
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                                                    🎫
                                                </div>
                                                <h3 className="font-bold text-lg mb-1 truncate">{event?.title || 'Événement inconnu'}</h3>
                                                <p className="text-sm text-neutral-400 mb-4 truncate">{event?.location || 'Lieu inconnu'}</p>

                                                <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                                    <span className="text-neutral-500">Réf: {ticket.reference}</span>
                                                    <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">Voir le QR →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4">Mes Informations</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Nom complet</label>
                                <div className="text-white font-medium">{user.fullName}</div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Téléphone</label>
                                <div className="text-white font-medium">{user.phoneNumber}</div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Email</label>
                                <div className="text-white font-medium">{user.email}</div>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full mt-6" size="sm">Modifier</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
