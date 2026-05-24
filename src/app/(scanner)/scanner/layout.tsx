import { getCurrentUser, logoutAction } from '@/features/auth/server/auth.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    if (!['ADMIN', 'SCANNER'].includes(user.role)) {
        redirect('/auth/login?error=not_scanner');
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <header className="bg-white border-b border-neutral-200 p-4 shrink-0 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hidden md:block">
                        <div className="flex items-center group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 shadow-sm flex items-center justify-center shrink-0">
                                <Image 
                                    src="/logo.jpg" 
                                    alt="NyotaPass Logo" 
                                    fill 
                                    className="object-cover" 
                                    priority
                                />
                            </div>
                        </div>
                    </Link>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 font-bold text-xs rounded-full uppercase tracking-widest border border-primary-200">
                        Mode Scan
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-600 hidden sm:inline-block">Agent: {user.fullName}</span>
                    <form action={logoutAction}>
                        <Button variant="outline" size="sm" type="submit" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50">Déconnexion</Button>
                    </form>
                </div>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
