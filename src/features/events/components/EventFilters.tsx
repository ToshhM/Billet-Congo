'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';

const SORT_OPTIONS = [
    { label: 'Date (proche)', value: 'date-asc' },
    { label: 'Date (lointaine)', value: 'date-desc' },
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
];

interface EventFiltersProps {
    total: number;
    cities?: { id: string; name: string }[];
    categories?: { id: string; name: string }[];
}

export function EventFilters({ total, cities = [], categories = [] }: EventFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const q = searchParams.get('q') ?? '';
    const sort = searchParams.get('sort') ?? 'date-asc';
    const vip = searchParams.get('vip') === '1';
    const available = searchParams.get('available') === '1';
    const city = searchParams.get('city') ?? '';
    const category = searchParams.get('category') ?? '';

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === '') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [router, pathname, searchParams]
    );

    const hasFilters = q || vip || available || sort !== 'date-asc' || city || category;

    return (
        <div className={`transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
            {/* Barre de recherche */}
            <div className="relative mb-5">
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 pointer-events-none"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="search"
                    value={q}
                    onChange={(e) => updateParams({ q: e.target.value || null })}
                    placeholder="Rechercher un événement..."
                    className="w-full bg-white border border-neutral-300 focus:border-primary-500 rounded-2xl pl-12 pr-4 py-4 text-neutral-900 placeholder:text-neutral-500 outline-none transition-colors text-base shadow-sm"
                />
                {isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                )}
            </div>

            {/* Filtres + Tri */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Catégorie */}
                <select
                    value={category}
                    onChange={(e) => updateParams({ category: e.target.value || null })}
                    className="bg-white border border-neutral-300 hover:border-neutral-400 text-sm text-neutral-700 rounded-xl px-4 py-2.5 outline-none cursor-pointer transition-colors shadow-sm"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {/* Ville */}
                <select
                    value={city}
                    onChange={(e) => updateParams({ city: e.target.value || null })}
                    className="bg-white border border-neutral-300 hover:border-neutral-400 text-sm text-neutral-700 rounded-xl px-4 py-2.5 outline-none cursor-pointer transition-colors shadow-sm"
                >
                    <option value="">Toutes les villes</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {/* Tri */}
                <select
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="bg-white border border-neutral-300 hover:border-neutral-400 text-sm text-neutral-700 rounded-xl px-4 py-2.5 outline-none cursor-pointer transition-colors shadow-sm"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {/* Filtre : Disponibles uniquement */}
                <button
                    onClick={() => updateParams({ available: available ? null : '1' })}
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 shadow-sm ${
                        available
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                    Disponibles
                </button>

                {/* Filtre : VIP */}
                <button
                    onClick={() => updateParams({ vip: vip ? null : '1' })}
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 shadow-sm ${
                        vip
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                >
                    ✦ VIP
                </button>

                {/* Reset */}
                {hasFilters && (
                    <button
                        onClick={() => router.replace(pathname, { scroll: false })}
                        className="ml-auto text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 transition-colors"
                    >
                        Réinitialiser
                    </button>
                )}

                {/* Compteur résultats */}
                <span className={`text-xs text-neutral-500 ${hasFilters ? '' : 'ml-auto'}`}>
                    {total} événement{total > 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
}
