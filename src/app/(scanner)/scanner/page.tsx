'use client';

import React, { useState, useRef, useEffect } from 'react';
import { submitScanAction } from '@/features/scanner/server/scanner.actions';
import { Button } from '@/shared/components/ui/Button';
import { ScanResult } from '@/features/scanner/services/scanner.service';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerPage() {
    const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
    const [reference, setReference] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastScan, setLastScan] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<ScanResult[]>([]);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const lastScannedRef = useRef<string>('');

    const processScan = async (code: string) => {
        setIsLoading(true);
        setLastScan(null);

        try {
            const result = await submitScanAction(code);
            setLastScan(result);
            setHistory(prev => [result, ...prev].slice(0, 10)); // Conserve les 10 derniers scans
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle manual form submission
    const handleManualScan = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!reference.trim() || isLoading) return;
        await processScan(reference.trim());
        setReference('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Handle camera scan
    const handleCameraScan = async (decodedText: string) => {
        if (isLoading || lastScannedRef.current === decodedText) return;
        
        lastScannedRef.current = decodedText;
        setTimeout(() => { lastScannedRef.current = ''; }, 3000); // 3 seconds cooldown
        
        await processScan(decodedText.trim());
    };

    // Use a ref to avoid stale closure in the scanner callback
    const handleCameraScanRef = useRef(handleCameraScan);
    useEffect(() => {
        handleCameraScanRef.current = handleCameraScan;
    });

    useEffect(() => {
        if (activeTab === 'camera') {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            );

            scanner.render(
                (decodedText) => {
                    handleCameraScanRef.current(decodedText);
                },
                (error) => {
                    // Ignore normal background scan failures
                }
            );

            return () => {
                scanner.clear().catch(console.error);
            };
        }
    }, [activeTab]);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Contrôle d&apos;accès</h1>
                <p className="text-neutral-400">Scannez un QR Code ou tapez la référence du ticket.</p>
            </div>

            {/* Onglets */}
            <div className="flex bg-neutral-900 rounded-2xl p-1 border border-white/10 mx-auto w-full max-w-md">
                <button 
                    onClick={() => setActiveTab('camera')}
                    className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'camera' ? 'bg-primary-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                >
                    📷 Appareil Photo
                </button>
                <button 
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'manual' ? 'bg-primary-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                >
                    ⌨️ Saisie Manuelle
                </button>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl mx-auto w-full max-w-xl">
                {activeTab === 'camera' ? (
                    <div className="flex flex-col items-center">
                        <div id="qr-reader" className="w-full max-w-sm rounded-2xl overflow-hidden [&_video]:rounded-2xl [&_video]:w-full"></div>
                        {isLoading && <p className="mt-4 text-primary-400 animate-pulse font-medium">Vérification en cours...</p>}
                    </div>
                ) : (
                    <form onSubmit={handleManualScan} className="flex flex-col gap-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Référence (ex: TKT-...)"
                            className="w-full bg-neutral-950 border-2 border-white/10 focus:border-primary-500 rounded-2xl px-6 py-5 text-xl text-center font-mono placeholder:text-neutral-600 outline-none transition-colors"
                            autoFocus
                        />
                        <Button type="submit" size="lg" className="h-16 text-xl" disabled={isLoading || !reference.trim()}>
                            {isLoading ? 'Vérification en cours...' : 'Valider le Billet'}
                        </Button>
                    </form>
                )}
            </div>

            {/* Résultat du dernier scan */}
            {lastScan && (
                <div className={`rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-2xl border-2 mx-auto w-full max-w-xl ${lastScan.success ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
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
                                <span className="font-mono break-all">{lastScan.ticket.reference}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Historique récent */}
            {history.length > 0 && (
                <div className="mt-4 mx-auto w-full max-w-xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⏱️ Journal Récent</h3>
                    <div className="space-y-3">
                        {history.map((h, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${h.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'} text-sm`}>
                                <div className="text-2xl">{h.success ? '✅' : '❌'}</div>
                                <div>
                                    <div className={`font-bold ${h.success ? 'text-emerald-400' : 'text-red-400'}`}>{h.message}</div>
                                    {h.ticket?.reference && <div className="font-mono text-neutral-500 mt-1 truncate max-w-[200px]">{h.ticket.reference}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
