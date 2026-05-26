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

export default async function OrganisateurEventsPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const isError = resolvedSearchParams.error === 'has_orders';

    const user = await getCurrentUser();
    const role = user?.role?.toUpperCase();

    if (!user || (role !== 'ADMIN' && role !== 'PROMOTER')) {
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
                            Des billets ou des réservations sont déjà associés à cet événement. Pour préserver l&apos;intégrité de la billetterie, sa suppression définitive est bloquée. Vous pouvez à la place le passer en <strong>Brouillon (non visible)</strong> en cliquant sur l&apos;icône 🌙.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white">Mes Événements</h1>
                    <p className="text-neutral-400 text-sm md:text-base">Gérez vos événements et suivez leur statut de publication.</p>
                </div>
                <div className="w-full md:w-auto">
                    <Link href="/organisateur/events/new" className="block w-full">
                        <Button className="w-full md:w-auto">+ Créer un événement</Button>
                    </Link>
                </div>
            </div>

            <Card className="overflow-hidden border-white/10 bg-transparent shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-sm text-neutral-400">
                                <th className="p-4 font-semibold whitespace-nowrap">Événement</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Date & Heure</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Tickets</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Statut</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-neutral-500 font-medium italic">
                                        Aucun événement créé pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-white mb-1 group-hover:text-accent-500 transition-colors">{event.title}</div>
                                            <div className="text-xs text-neutral-400">{event.location}</div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="text-white">{new Date(event.startDate).toLocaleDateString('fr-FR')}</div>
                                            <div className="text-xs text-neutral-400">{new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-400">
                                                    <span>{event.availableTickets} / {event.capacity}</span>
                                                    <span>{Math.round((event.availableTickets / event.capacity) * 100)}% restants</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            (event.availableTickets / event.capacity) < 0.2 ? 'bg-orange-500' : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${(event.availableTickets / event.capacity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                event.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                event.status === 'DRAFT' ? 'bg-white/10 text-neutral-400 border border-white/20' :
                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                                {event.status === 'PUBLISHED' ? 'Publié' : event.status}
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
                                                        {event.status === 'PUBLISHED' ? '🌙' : '☀️'}
                                                    </Button>
                                                </form>

                                                <Link href={`/organisateur/events/${event.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="text-accent-500 hover:bg-white/5" title="Éditer">
                                                        ✏️
                                                    </Button>
                                                </Link>

                                                <form action={async (formData) => {
                                                    'use server';
                                                    await deleteEventAction(formData);
                                                }}>
                                                    <input type="hidden" name="id" value={event.id} />
                                                    <Button variant="ghost" size="sm" type="submit" className="text-red-500 hover:bg-red-500/10" title="Supprimer">
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
