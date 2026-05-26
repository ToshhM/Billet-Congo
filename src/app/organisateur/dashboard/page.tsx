import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { eventService } from '@/features/events/services/event.service';

export default async function OrganisateurDashboardPage() {
    const user = await getCurrentUser();
    const role = user?.role?.toUpperCase();

    if (!user || (role !== 'ADMIN' && role !== 'PROMOTER')) {
        redirect('/auth/login?error=not_authorized');
    }

    const stats = await eventService.getDashboardStats(user.id, user.role);

    return (
        <div className="p-4 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white">Tableau de bord</h1>
                    <p className="text-neutral-400 text-sm md:text-base">
                        Bienvenue dans votre espace de gestion d&apos;événements.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/organisateur/events/new" className="flex-1 md:flex-initial">
                        <Button className="w-full">Créer un événement</Button>
                    </Link>
                </div>
            </div>

            {/* Statistiques clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-emerald-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Chiffre d&apos;Affaires</h3>
                    <div className="text-3xl font-bold text-white mb-1">{new Intl.NumberFormat('fr-FR').format(stats.totalRevenue)} XAF</div>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Ventes totales
                    </p>
                </Card>

                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-accent-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Billets Vendus</h3>
                    <div className="text-3xl font-bold text-white mb-1">{stats.ticketsSold}</div>
                    <p className="text-xs text-accent-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(203,163,92,0.8)]"></span>
                        Sur vos événements
                    </p>
                </Card>

                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-amber-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Mes Événements</h3>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeEventsCount}</div>
                    <p className="text-xs text-amber-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Publiés
                    </p>
                </Card>
            </div>

            {/* Zone d'activité (Placeholder) */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 shadow-sm overflow-hidden relative">
                 {/* Decorative gradient */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 blur-[100px] -mr-32 -mt-32"></div>
                 
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                        📅 Activité Récente
                    </h2>
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/20">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                            🔍
                        </div>
                        <p className="text-neutral-400 mb-2 font-medium">Aucune activité enregistrée pour le moment.</p>
                        <p className="text-xs text-neutral-500">Les ventes en temps réel s&apos;afficheront ici.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
