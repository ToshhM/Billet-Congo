import { getCurrentUser, logoutAction } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default async function OrganisateurLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const role = user?.role?.toUpperCase();

    if (!user) {
        redirect('/auth/login');
    }

    // Seuls les PROMOTER et ADMIN peuvent accéder à cet espace
    const isAuthorized = role === 'ADMIN' || role === 'PROMOTER';
    
    if (!isAuthorized) {
        redirect('/auth/login?error=not_authorized');
    }

    return (
        <div className="min-h-screen bg-[#050811] flex flex-col md:flex-row pb-16 md:pb-0">
            {/* Sidebar Organisateur (Desktop) */}
            <aside className="w-64 bg-[#0B1020] border-r border-white/10 hidden md:flex flex-col h-screen sticky top-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                <div className="p-6 border-b border-white/10 flex flex-col items-center">
                    <Link href="/" className="flex items-center group">
                        <div className="relative w-12 h-12 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-sm flex items-center justify-center shrink-0">
                            <Image 
                                src="/logo.jpg" 
                                alt="NyotaPass Logo" 
                                fill 
                                className="object-cover" 
                                priority
                            />
                        </div>
                    </Link>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-4">Espace Organisateur</p>
                </div>

                {/* Infos utilisateur connecté */}
                <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-500/10 text-accent-500 border border-accent-500/20">
                        {role === 'ADMIN' ? 'Administrateur' : 'Organisateur'}
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/organisateur/dashboard" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-accent-500 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        📊 Tableau de bord
                    </Link>
                    <Link href="/organisateur/events" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-accent-500 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        🎟️ Mes Événements
                    </Link>
                    <Link href="/organisateur/events/new" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-accent-500 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        ➕ Créer un événement
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <form action={logoutAction}>
                        <Button variant="outline" fullWidth type="submit" className="justify-start gap-3 border-white/10 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20">
                            🚪 Déconnexion
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B1020] border-t border-white/10 flex justify-around items-center p-2 z-50 h-16 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
                <Link href="/organisateur/dashboard" className="flex flex-col items-center gap-1 p-2 text-neutral-400 hover:text-accent-500 transition-colors">
                    <span className="text-lg">📊</span>
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>
                <Link href="/organisateur/events" className="flex flex-col items-center gap-1 p-2 text-neutral-400 hover:text-accent-500 transition-colors">
                    <span className="text-lg">🎟️</span>
                    <span className="text-[10px] font-medium">Événements</span>
                </Link>
                <Link href="/organisateur/events/new" className="flex flex-col items-center gap-1 p-2 text-neutral-400 hover:text-accent-500 transition-colors">
                    <span className="text-lg">➕</span>
                    <span className="text-[10px] font-medium">Créer</span>
                </Link>
                <form action={logoutAction} className="flex flex-col items-center">
                    <button type="submit" className="flex flex-col items-center gap-1 p-2 text-neutral-400 hover:text-red-500 transition-colors">
                        <span className="text-lg">🚪</span>
                        <span className="text-[10px] font-medium">Sortir</span>
                    </button>
                </form>
            </nav>

            {/* Contenu Principal */}
            <main className="flex-1 w-full overflow-x-hidden p-0 md:p-0">
                {children}
            </main>
        </div>
    );
}
