import { createOrUpdateEventAction } from '@/features/events/server/event.actions';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default function NewEventPage() {
    return (
        <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/events" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    ← Retour aux événements
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Créer un événement</h1>

            <Card className="p-8">
                <form action={createOrUpdateEventAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Titre de l&apos;événement</label>
                            <input type="text" name="title" required className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Concert de fin d'année" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Description</label>
                            <textarea name="description" required rows={4} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Description de l'événement..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Lieu</label>
                            <input type="text" name="location" required className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Palais des Congrès" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Date et heure de début</label>
                            <input type="datetime-local" name="startDate" required className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Prix du billet (XAF)</label>
                            <input type="number" name="price" min="0" required className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Capacité (Nombre de places)</label>
                            <input type="number" name="capacity" min="1" required className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1000" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">URL de l&apos;image (Affiche)</label>
                            <input type="url" name="imageUrl" className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Statut de publication</label>
                            <select name="status" className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="DRAFT">Brouillon (Non visible)</option>
                                <option value="PUBLISHED">Publié (En vente)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                        <Link href="/admin/events">
                            <Button type="button" variant="ghost">Annuler</Button>
                        </Link>
                        <Button type="submit">Créer l&apos;événement</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
