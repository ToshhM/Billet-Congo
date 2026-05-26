import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { eventService } from '@/features/events/services/event.service';

export default async function AdminDashboardPage() {
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
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white">
                        {role === 'ADMIN' ? 'Administrateur' : 'Organisateur'}
                    </h1>
                    <p className="text-neutral-400 text-sm md:text-base">
                        {role === 'ADMIN' 
                            ? 'Vue globale et gestion complète de la plateforme.' 
                            : 'Gérez vos événements et suivez vos statistiques de vente.'}
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    {role === 'ADMIN' && (
                        <Link href="/admin/users" className="flex-1 md:flex-initial">
                            <Button variant="outline" className="w-full">Gérer les utilisateurs</Button>
                        </Link>
                    )}
                    <Link href="/admin/events/new" className="flex-1 md:flex-initial">
                        <Button className="w-full">Créer un événement</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-emerald-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Chiffre d&apos;Affaires</h3>
                    <div className="text-3xl font-bold text-white mb-1">{new Intl.NumberFormat('fr-FR').format(stats.totalRevenue)} XAF</div>
                    <p className="text-xs text-emerald-400">Total des ventes validées</p>
                </Card>

                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-accent-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Billets Vendus</h3>
                    <div className="text-3xl font-bold text-white mb-1">{stats.ticketsSold}</div>
                    <p className="text-xs text-accent-400">Sur l&apos;ensemble des événements</p>
                </Card>

                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-amber-500">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Événements Actifs</h3>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeEventsCount}</div>
                    <p className="text-xs text-amber-400">Publiés dans le catalogue</p>
                </Card>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-white">Dernières ventes</h2>
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/20">
                    <p className="text-neutral-400 mb-2">Aucune vente enregistrée aujourd&apos;hui.</p>
                    <p className="text-xs text-neutral-500">En attente de nouvelles transactions Mobile Money...</p>
                </div>
            </div>
        </div>
    );
}
