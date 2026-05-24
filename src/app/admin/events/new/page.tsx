import { createOrUpdateEventAction } from '@/features/events/server/event.actions';
import { getCities } from '@/features/events/services/city.service';
import { getCategories } from '@/features/events/services/category.service';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function NewEventPage() {
    const [cities, categories] = await Promise.all([
        getCities(),
        getCategories(),
    ]);

    return (
        <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/events" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    ← Retour aux événements
                </Link>
            </div>

            <h1 className="text-3xl font-heading font-bold mb-8 text-white">Créer un événement</h1>

            <Card className="p-8 border-none relative overflow-hidden">
                <form action={createOrUpdateEventAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Titre de l&apos;événement</label>
                            <input type="text" name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="Ex: Concert de fin d'année" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Description</label>
                            <textarea name="description" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="Description de l'événement..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Catégorie</label>
                            <select name="categoryId" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Ville</label>
                            <select name="cityId" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une ville</option>
                                {cities.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Adresse / Lieu exact</label>
                            <input type="text" name="location" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="Ex: Palais des Congrès" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Date et heure de début</label>
                            <input type="datetime-local" name="startDate" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Date et heure de fin (Optionnel)</label>
                            <input type="datetime-local" name="endDate" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Prix du billet STANDARD (XAF)</label>
                            <input type="number" name="price" min="0" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="10000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Capacité STANDARD (Places)</label>
                            <input type="number" name="capacity" min="1" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="1000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Prix du billet VIP (XAF) - Optionnel</label>
                            <input type="number" name="vipPrice" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="25000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Capacité VIP (Places) - Optionnel</label>
                            <input type="number" name="vipCapacity" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" placeholder="100" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Photo de l&apos;Affiche (Depuis l&apos;appareil)</label>
                            <input type="file" name="imageFile" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent-500/10 file:text-accent-500 hover:file:bg-white/10 file:border file:border-accent-500/20 cursor-pointer" />
                        </div>

                        <div className="md:col-span-2 text-neutral-500">
                            <label className="block text-sm font-medium mb-2">OU URL de l&apos;image</label>
                            <input type="url" name="imageUrl" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm text-sm" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Statut de publication</label>
                            <select name="status" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="DRAFT" className="text-neutral-900">Brouillon (Non visible)</option>
                                <option value="PUBLISHED" className="text-neutral-900">Publié (En vente)</option>
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
