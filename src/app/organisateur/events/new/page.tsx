import { createOrUpdateEventAction } from '@/features/events/server/event.actions';
import { getCities } from '@/features/events/services/city.service';
import { getCategories } from '@/features/events/services/category.service';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function OrganisateurNewEventPage() {
    const [cities, categories] = await Promise.all([
        getCities(),
        getCategories(),
    ]);

    return (
        <div className="p-4 md:p-12 max-w-4xl mx-auto">
            <div className="mb-6 text-primary-600">
                <Link href="/organisateur/events" className="text-sm font-medium hover:text-primary-700 transition-colors flex items-center gap-2">
                    ← Retourner à mes événements
                </Link>
            </div>

            <h1 className="text-3xl font-heading font-bold mb-8 text-white">Créer un nouvel événement</h1>

            <Card className="p-8 border-neutral-200 bg-white shadow-sm">
                <form action={createOrUpdateEventAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Titre de l&apos;événement</label>
                            <input type="text" name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all" placeholder="Ex: Festival des Arts de Brazzaville" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Description complète</label>
                            <textarea name="description" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all" placeholder="Décrivez votre événement en quelques lignes..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Catégorie</label>
                            <select name="categoryId" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Ville</label>
                            <select name="cityId" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une ville</option>
                                {cities.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Lieu / Adresse exacte</label>
                            <input type="text" name="location" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all" placeholder="Ex: Palais du Peuple" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Date et Heure de Début</label>
                            <input type="datetime-local" name="startDate" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Date et Heure de Fin (Optionnel)</label>
                            <input type="datetime-local" name="endDate" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Prix Standard (XAF)</label>
                            <input type="number" name="price" min="0" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all font-mono" placeholder="5000" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Places Standard Total</label>
                            <input type="number" name="capacity" min="1" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all font-mono" placeholder="500" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-amber-600 uppercase tracking-widest text-[10px] font-bold italic">Prix VIP (XAF) - Facultatif</label>
                            <input type="number" name="vipPrice" min="0" className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-neutral-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" placeholder="20000" />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-amber-600 uppercase tracking-widest text-[10px] font-bold italic">Places VIP Total - Facultatif</label>
                            <input type="number" name="vipCapacity" min="0" className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 text-neutral-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" placeholder="50" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-neutral-600 uppercase tracking-widest text-[10px] font-bold">Photo de l&apos;Affiche (Depuis l&apos;appareil)</label>
                            <input type="file" name="imageFile" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent-500/10 file:text-accent-500 hover:file:bg-white/10 file:border file:border-accent-500/20 cursor-pointer" />
                            <p className="text-[10px] text-neutral-500 mt-2 italic px-1">L&apos;image sera compressée et stockée avec l&apos;événement.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-neutral-500 uppercase tracking-widest text-[10px] font-bold">OU URL de l&apos;image</label>
                            <input type="url" name="imageUrl" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-600 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2 text-primary-700 bg-primary-50 p-4 rounded-xl border border-primary-100 mb-4">
                            <label className="block text-sm mb-2 uppercase tracking-widest text-[10px] font-bold">Statut de mise en ligne</label>
                            <select name="status" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold">
                                <option value="DRAFT">Brouillon (Enregistrer sans publier)</option>
                                <option value="PUBLISHED">Publier maintenant (Cataloguer)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                        <Link href="/organisateur/events">
                            <Button type="button" variant="ghost">Annuler</Button>
                        </Link>
                        <Button type="submit">Créer l&apos;événement</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
