import { createOrUpdateEventAction } from '@/features/events/server/event.actions';
import { eventService } from '@/features/events/services/event.service';
import { getCities } from '@/features/events/services/city.service';
import { getCategories } from '@/features/events/services/category.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'PROMOTER'].includes(user.role)) redirect('/auth/login');

    const resolvedParams = await params;
    const [event, cities, categories] = await Promise.all([
        eventService.getEventById(resolvedParams.id),
        getCities(),
        getCategories(),
    ]);

    if (!event) notFound();

    // Verification des permissions pour les promoteurs
    if (user.role === 'PROMOTER' && event.organizerId !== user.id) {
        redirect('/admin/events');
    }

    // Format date for datetime-local input
    const formattedStartDate = new Date(event.startDate).toISOString().slice(0, 16);
    const formattedEndDate = event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '';

    return (
        <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/events" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    ← Retour aux événements
                </Link>
            </div>

            <h1 className="text-3xl font-heading font-bold mb-8 text-white">Éditer l&apos;événement</h1>

            <Card className="p-8 border-none relative overflow-hidden">
                <form action={createOrUpdateEventAction} className="space-y-6">
                    <input type="hidden" name="id" value={event.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Titre de l&apos;événement</label>
                            <input type="text" name="title" defaultValue={event.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Description</label>
                            <textarea name="description" defaultValue={event.description} required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Catégorie</label>
                            <select name="categoryId" defaultValue={event.categoryId || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Ville</label>
                            <select name="cityId" defaultValue={event.cityId || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="" className="text-neutral-900">Sélectionnez une ville</option>
                                {cities.map(c => (
                                    <option key={c.id} value={c.id} className="text-neutral-900">{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Adresse / Lieu exact</label>
                            <input type="text" name="location" defaultValue={event.location} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-neutral-300">Début</label>
                                <input type="datetime-local" name="startDate" defaultValue={formattedStartDate} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-neutral-300">Fin (Opt.)</label>
                                <input type="datetime-local" name="endDate" defaultValue={formattedEndDate} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Prix du billet STANDARD (XAF)</label>
                            <input type="number" name="price" defaultValue={event.price} min="0" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Capacité STANDARD (Places)</label>
                            <input type="number" name="capacity" defaultValue={event.capacity} min="1" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Prix du billet VIP (XAF)</label>
                            <input type="number" name="vipPrice" defaultValue={event.vipPrice || ''} min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Capacité VIP (Places)</label>
                            <input type="number" name="vipCapacity" defaultValue={event.vipCapacity || ''} min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Photo de l&apos;Affiche</label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {event.imageUrl && (
                                    <div className="w-32 h-44 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0">
                                        <div className="relative w-full h-full">
                                            <Image src={event.imageUrl} alt="Actuelle" fill className="object-cover" unoptimized />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 w-full space-y-4">
                                    <input type="file" name="imageFile" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent-500/10 file:text-accent-500 hover:file:bg-white/10 file:border file:border-accent-500/20 cursor-pointer" />
                                    <input type="url" name="imageUrl" defaultValue={event.imageUrl || ''} placeholder="Ou URL de l'image..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-neutral-300">Statut de publication</label>
                            <select name="status" defaultValue={event.status} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm">
                                <option value="DRAFT" className="text-neutral-900">Brouillon (Non visible)</option>
                                <option value="PUBLISHED" className="text-neutral-900">Publié (En vente)</option>
                                <option value="CANCELLED" className="text-neutral-900">Annulé</option>
                                <option value="COMPLETED" className="text-neutral-900">Terminé</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                        <Link href="/admin/events">
                            <Button type="button" variant="ghost">Annuler</Button>
                        </Link>
                        <Button type="submit">Enregistrer les modifications</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
