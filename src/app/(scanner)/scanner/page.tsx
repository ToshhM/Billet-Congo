'use client';

import React, { useState, useRef } from 'react';
import { submitScanAction } from '@/features/scanner/server/scanner.actions';
import { Button } from '@/shared/components/ui/Button';
import { ScanResult } from '@/features/scanner/services/scanner.service';

export default function ScannerPage() {
    const [reference, setReference] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastScan, setLastScan] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<ScanResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleScan = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!reference.trim() || isLoading) return;

        setIsLoading(true);
        setLastScan(null);

        try {
            const result = await submitScanAction(reference.trim());
            setLastScan(result);
            setHistory(prev => [result, ...prev].slice(0, 10)); // Conserve les 10 derniers scans
            setReference('');

            // Focus back to input for rapid hardware scanner logic
            setTimeout(() => inputRef.current?.focus(), 100);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Contrôle d&apos;accès</h1>
                <p className="text-neutral-400">Scannez un QR Code ou tapez la référence du ticket.</p>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
                <form onSubmit={handleScan} className="flex flex-col gap-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Référence (ex: TKT-2024-XXXX)"
                        className="w-full bg-neutral-950 border-2 border-white/10 focus:border-indigo-500 rounded-2xl px-6 py-5 text-xl text-center font-mono placeholder:text-neutral-600 outline-none transition-colors"
                        autoFocus
                    />
                    <Button type="submit" size="lg" className="h-16 text-xl" disabled={isLoading || !reference.trim()}>
                        {isLoading ? 'Vérification en cours...' : 'Valider le Billet'}
                    </Button>
                </form>
            </div>

            {lastScan && (
                <div className={`rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-2xl border-2 ${lastScan.success ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                    <div className="text-6xl mb-4">{lastScan.success ? '✅' : '❌'}</div>
                    <h2 className="text-3xl font-bold mb-2">{lastScan.success ? 'ACCÈS AUTORISÉ' : 'ACCÈS REFUSÉ'}</h2>
                    <p className="text-lg font-medium">{lastScan.message}</p>

                    {lastScan.ticket && (
                        <div className="mt-6 pt-6 border-t border-current/20 text-sm text-left grid grid-cols-2 gap-4 opacity-90">
                            <div>
                                <span className="block opacity-70 text-xs uppercase tracking-widest mb-1">Evénement ID</span>
                                <span className="font-bold">{lastScan.ticket.eventId}</span>
                            </div>
                            <div>
                                <span className="block opacity-70 text-xs uppercase tracking-widest mb-1">Réf</span>
                                <span className="font-mono">{lastScan.ticket.reference}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⏱️ Journal Récent</h3>
                    <div className="space-y-3">
                        {history.map((h, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${h.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'} text-sm`}>
                                <div className="text-2xl">{h.success ? '✅' : '❌'}</div>
                                <div>
                                    <div className={`font-bold ${h.success ? 'text-emerald-400' : 'text-red-400'}`}>{h.message}</div>
                                    {h.ticket?.reference && <div className="font-mono text-neutral-500 mt-1">{h.ticket.reference}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
