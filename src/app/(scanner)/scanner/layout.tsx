import { getCurrentUser, logoutAction } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user || !['ADMIN', 'SCANNER'].includes(user.role)) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            <header className="bg-neutral-900 border-b border-white/10 p-4 shrink-0 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold text-white hidden md:block">
                        CongoTickets
                    </Link>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 font-bold text-xs rounded-full uppercase tracking-widest">
                        Mode Scan
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-400 hidden sm:inline-block">Agent: {user.fullName}</span>
                    <form action={logoutAction}>
                        <Button variant="ghost" size="sm" type="submit">Déconnexion</Button>
                    </form>
                </div>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
