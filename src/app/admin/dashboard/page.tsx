import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function AdminDashboardPage() {
    return (
        <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
                    <p className="text-neutral-400">Gérez votre plateforme de billetterie en temps réel.</p>
                </div>
                <Link href="/admin/events/new">
                    <Button>Créer un événement</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="p-6 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Chiffre d&apos;Affaires</h3>
                    <div className="text-3xl font-bold text-white mb-1">0 XAF</div>
                    <p className="text-xs text-emerald-400">Total des ventes validées</p>
                </Card>

                <Card className="p-6 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Billets Vendus</h3>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <p className="text-xs text-indigo-400">Sur l&apos;ensemble des événements</p>
                </Card>

                <Card className="p-6 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 mb-2">Événements Actifs</h3>
                    <div className="text-3xl font-bold text-white mb-1">3</div>
                    <p className="text-xs text-purple-400">Publiés dans le catalogue</p>
                </Card>
            </div>

            <div className="bg-neutral-900 rounded-3xl border border-white/10 p-8 shadow-2xl">
                <h2 className="text-xl font-bold mb-6">Dernières ventes</h2>
                <div className="text-center py-20 bg-neutral-950 rounded-2xl border border-dashed border-white/20">
                    <p className="text-neutral-500 mb-2">Aucune vente enregistrée aujourd&apos;hui.</p>
                    <p className="text-xs text-neutral-600">En attente de nouvelles transactions Mobile Money...</p>
                </div>
            </div>
        </div>
    );
}
