'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { submitScanAction } from '@/features/scanner/server/scanner.actions';
import { ScanResult } from '@/features/scanner/services/scanner.service';

/* ── Types ────────────────────────────────────── */
type Tab = 'camera' | 'manual';

/* ── Helpers ──────────────────────────────────── */
function StatusBadge({ success }: { success: boolean }) {
    return success ? (
        <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center animate-in zoom-in-75 duration-300">
                <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-2xl font-black text-emerald-400 tracking-wider uppercase">Accès Autorisé</span>
        </div>
    ) : (
        <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center animate-in zoom-in-75 duration-300">
                <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <span className="text-2xl font-black text-red-400 tracking-wider uppercase">Accès Refusé</span>
        </div>
    );
}

function TicketInfoRow({ label, value, accent }: { label: string; value?: string | null; accent?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">{label}</span>
            <span className={`font-semibold text-sm ${accent ? 'text-amber-600' : 'text-neutral-900'}`}>{value}</span>
        </div>
    );
}

/* ── Main Component ───────────────────────────── */
export default function ScannerPage() {
    const [activeTab, setActiveTab] = useState<Tab>('camera');
    const [reference, setReference] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastScan, setLastScan] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<ScanResult[]>([]);
    const [scannerReady, setScannerReady] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const lastScannedRef = useRef<string>('');
    const scannerInstanceRef = useRef<import('html5-qrcode').Html5QrcodeScanner | null>(null);

    /* ── Process ────────────────────────────────── */
    const processScan = useCallback(async (code: string) => {
        setIsLoading(true);
        setLastScan(null);
        try {
            const result = await submitScanAction(code);
            setLastScan(result);
            setHistory(prev => [result, ...prev].slice(0, 15));
        } catch (err) {
            console.error(err);
            setLastScan({ success: false, message: 'Erreur réseau. Réessayez.' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleManualScan = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!reference.trim() || isLoading) return;
        await processScan(reference.trim());
        setReference('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleCameraScan = useCallback(async (decodedText: string) => {
        if (isLoading || lastScannedRef.current === decodedText) return;
        lastScannedRef.current = decodedText;
        setTimeout(() => { lastScannedRef.current = ''; }, 3000);
        await processScan(decodedText.trim());
    }, [isLoading, processScan]);

    /* ── Camera init ────────────────────────────── */
    useEffect(() => {
        if (activeTab !== 'camera') return;

        let scanner: import('html5-qrcode').Html5QrcodeScanner | null = null;
        setScannerReady(false);

        const initScanner = async () => {
            const { Html5QrcodeScanner } = await import('html5-qrcode');
            scanner = new Html5QrcodeScanner(
                "qr-reader-container",
                { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
                false
            );
            scannerInstanceRef.current = scanner;
            scanner.render(
                (text: string) => handleCameraScan(text),
                () => { /* ignore scan failures */ }
            );
            setScannerReady(true);
        };

        initScanner().catch(console.error);

        return () => {
            if (scanner) scanner.clear().catch(console.error);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    /* ── Render ─────────────────────────────────── */
    return (
        <div className="flex flex-col gap-6 pb-12">

            {/* Header */}
            <div className="text-center pt-2">
                <h1 className="text-2xl font-black tracking-tight mb-1">Contrôle d&apos;Accès</h1>
                <p className="text-neutral-500 text-sm">Scannez ou saisissez la référence du billet</p>
            </div>

            {/* Onglets */}
            <div className="flex bg-neutral-100 rounded-2xl p-1 border border-neutral-200">
                {(['camera', 'manual'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setLastScan(null); }}
                        className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                            activeTab === tab
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        {tab === 'camera' ? '📷 Appareil Photo' : '⌨️ Saisie Manuelle'}
                    </button>
                ))}
            </div>

            {/* Zone de scan */}
            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                {activeTab === 'camera' ? (
                    <div className="flex flex-col items-center p-6 gap-4">
                        {/* Scanner QR */}
                        <div className="relative w-full max-w-sm">
                            <div
                                id="qr-reader-container"
                                className="w-full rounded-2xl overflow-hidden [&_video]:rounded-xl [&_video]:w-full [&_#qr-reader-container__dashboard]:hidden [&_#qr-reader__dashboard]:hidden"
                            />
                            {/* Overlay de chargement initial */}
                            {!scannerReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 rounded-2xl">
                                    <div className="text-center">
                                        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                        <p className="text-neutral-500 text-sm">Initialisation caméra...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cadre visuel indicatif */}
                        {scannerReady && (
                            <p className="text-xs text-neutral-500 text-center">
                                Placez le QR code dans le cadre pour le scanner automatiquement
                            </p>
                        )}

                        {isLoading && (
                            <div className="flex items-center gap-3 text-primary-600 font-semibold text-sm animate-pulse">
                                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                Vérification en cours...
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleManualScan} className="p-6 flex flex-col gap-4">
                        <label className="block text-sm font-medium text-neutral-600">Référence du billet</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="TKT-XXXXXXXX"
                            autoFocus
                            autoComplete="off"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-primary-500 rounded-2xl px-5 py-4 text-2xl text-center font-mono tracking-widest placeholder:text-neutral-400 outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !reference.trim()}
                            className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Vérification...
                                </>
                            ) : (
                                'Valider le Billet'
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Résultat du scan */}
            {lastScan && (
                <div className={`rounded-3xl p-6 border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                    lastScan.success
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex flex-col items-center text-center gap-4">
                        <StatusBadge success={lastScan.success} />
                        <p className={`text-base font-semibold ${lastScan.success ? 'text-emerald-700' : 'text-red-700'}`}>
                            {lastScan.message}
                        </p>

                        {/* Infos billet */}
                        {lastScan.ticket && (
                            <div className="w-full mt-2 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-4 text-left">
                                <TicketInfoRow label="Événement" value={lastScan.ticket.eventTitle} />
                                <TicketInfoRow label="Porteur" value={lastScan.ticket.holderName} />
                                <TicketInfoRow
                                    label="Type de billet"
                                    value={lastScan.ticket.ticketType}
                                    accent={lastScan.ticket.ticketType === 'VIP'}
                                />
                                <TicketInfoRow label="Référence" value={lastScan.ticket.reference} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Journal des scans */}
            {history.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Journal récent</h3>
                        <button
                            onClick={() => setHistory([])}
                            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
                        >
                            Effacer
                        </button>
                    </div>
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                                    h.success
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                        : 'bg-red-50 border-red-100 text-red-800'
                                }`}
                            >
                                <span className="text-lg shrink-0">{h.success ? '✅' : '❌'}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate">
                                        {h.ticket?.eventTitle ?? '—'}
                                    </div>
                                    <div className="text-xs opacity-60 font-mono truncate">
                                        {h.ticket?.reference ?? h.message}
                                    </div>
                                </div>
                                {h.ticket?.ticketType === 'VIP' && (
                                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase">VIP</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
