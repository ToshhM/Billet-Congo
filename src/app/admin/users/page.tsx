import React from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { DeleteUserButton } from '@/features/auth/components/DeleteUserButton';
import { redirect } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import Link from 'next/link';

export default async function AdminUsersPage() {
    const currentUser = await getCurrentUser();
    
    // Protection : seul l'ADMIN peut accéder à cette page
    if (!currentUser || currentUser.role.toUpperCase() !== 'ADMIN') {
        redirect('/admin/dashboard');
    }

    const users = await authService.getUsers();

    return (
        <div className="p-4 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2 text-white">Utilisateurs</h1>
                    <p className="text-neutral-400 text-sm md:text-base">Gérez les comptes ADMIN, PROMOTER et SCANNER.</p>
                </div>
                <div className="w-full md:w-auto">
                    <Link href="/admin/users/new" className="block w-full">
                        <Button className="w-full md:w-auto">+ Nouvel Utilisateur</Button>
                    </Link>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-transparent">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-sm text-neutral-400">
                                <th className="p-4 font-semibold text-accent-500">Rôle</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Nom complet</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Email / Téléphone</th>
                                <th className="p-4 font-semibold whitespace-nowrap">Date d&apos;inscription</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-neutral-500 italic">
                                        Aucun utilisateur enregistré.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                                u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                u.role === 'PROMOTER' ? 'bg-accent-500/10 text-accent-500 border border-accent-500/20' :
                                                u.role === 'SCANNER' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                'bg-white/10 text-neutral-300 border border-white/20'
                                            }`}>
                                                {u.role === 'PROMOTER' ? 'Organisateur' : u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-white whitespace-nowrap">{u.fullName}</td>
                                        <td className="p-4 text-sm whitespace-nowrap">
                                            <div className="text-white mb-0.5">{u.email}</div>
                                            <div className="text-neutral-500 font-mono text-xs">{u.phoneNumber}</div>
                                        </td>
                                        <td className="p-4 text-neutral-500 text-sm whitespace-nowrap">
                                            {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/users/${u.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="text-accent-500 hover:bg-white/5" title="Modifier">
                                                        ✏️
                                                    </Button>
                                                </Link>
                                                
                                                {u.id !== currentUser.id && (
                                                    <DeleteUserButton userId={u.id} />
                                                )}
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
