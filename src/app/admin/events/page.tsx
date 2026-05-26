import { eventService } from '@/features/events/services/event.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { deleteEventAction, toggleEventStatusAction } from '@/features/events/server/event.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import Link from 'next/link';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const isError = resolvedSearchParams.error === 'has_orders';

    const user = await getCurrentUser();
    if (!user || (user.role.toUpperCase() !== 'ADMIN' && user.role.toUpperCase() !== 'PROMOTER')) {
        redirect('/auth/login?error=not_authorized');
    }

    const events = await eventService.getAdminEvents(user.id, user.role);

    return (
        <div className="p-4 md:p-12">
            {isError && (
                <div className="mb-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 flex gap-4 items-start shadow-lg shadow-red-500/5 animate-fade-in">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <h3 className="font-bold text-white mb-0.5">Impossible de supprimer cet événement</h3>
                        <p className="text-sm text-neutral-300">
                            Des billets ou des réservations sont déjà associés à cet événement. Pour préserver l&apos;intégrité de la billetterie, sa suppression définitive est bloquée. Vous pouvez à la place le passer en <strong>Brouillon (non visible)</strong> en cliquant sur l&apos;icône 👁️.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white">Gestion des événements</h1>
                    <p className="text-neutral-400 text-sm md:text-base">Gérez le catalogue des événements visibles par les clients.</p>
                </div>
                <div className="w-full md:w-auto">
                    <Link href="/admin/events/new" className="block w-full">
                        <Button className="w-full md:w-auto">+ Nouvel événement</Button>
                    </Link>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-900 border-b border-white/10 text-sm text-neutral-400">
                                <th className="p-4 font-semibold whitespace-nowrap">Titre & Lieu</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Prix (XAF)</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Tickets (Restants / Total)</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Statut</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                                        Aucun événement trouvé.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white mb-1 line-clamp-1">{event.title}</div>
                                            <div className="text-xs text-neutral-400 line-clamp-1">{event.location}</div>
                                        </td>
                                        <td className="p-4 text-sm whitespace-nowrap">
                                            {new Date(event.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })} <br />
                                            <span className="text-neutral-500">{new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="p-4 font-semibold text-indigo-400">
                                            {new Intl.NumberFormat('fr-FR').format(event.price)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-neutral-800 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className={`h-2 rounded-full ${event.availableTickets < event.capacity * 0.2 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${(event.availableTickets / event.capacity) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold">{event.availableTickets}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${event.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    event.status === 'DRAFT' ? 'bg-neutral-500/20 text-neutral-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={async (formData) => {
                                                    'use server';
                                                    await toggleEventStatusAction(formData);
                                                }}>
                                                    <input type="hidden" name="id" value={event.id} />
                                                    <input type="hidden" name="currentStatus" value={event.status} />
                                                    <Button variant="ghost" size="sm" type="submit" className="text-neutral-400 hover:text-white" title={event.status === 'PUBLISHED' ? 'Passer en brouillon' : 'Publier'}>
                                                        {event.status === 'PUBLISHED' ? '👁️‍🗨️' : '👁️'}
                                                    </Button>
                                                </form>

                                                <Link href={`/admin/events/${event.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-500/10" title="Éditer">
                                                        ✏️
                                                    </Button>
                                                </Link>

                                                <form action={async (formData) => {
                                                    'use server';
                                                    await deleteEventAction(formData);
                                                }}>
                                                    <input type="hidden" name="id" value={event.id} />
                                                    <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:bg-red-500/10" title="Supprimer">
                                                        🗑️
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
