'use client';

import { useState } from 'react';
import { Button } from './Button';
import { incrementDownloadCountAction } from '@/features/tickets/server/ticket.actions';

interface Props {
    ticketId: string;
    role: string;
    downloadCount: number;
    targetElementId: string;
}

export function DownloadTicketButton({ ticketId, role, downloadCount, targetElementId }: Props) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [localCount, setLocalCount] = useState(downloadCount);

    const isGuest = role === 'GUEST';
    const canDownload = !isGuest || localCount < 1;

    const handleDownload = async () => {
        if (!canDownload) return;
        setIsDownloading(true);

        try {
            // Lazy load the dependencies to keep the bundle small and avoid SSR issues
            const htmlToImage = await import('html-to-image');
            const { jsPDF } = await import('jspdf');

            const element = document.getElementById(targetElementId);
            if (!element) throw new Error("Element non trouvé");

            // Convertir l'élément en image PNG avec un haut niveau de détails (pixelRatio)
            const dataUrl = await htmlToImage.toPng(element, { 
                quality: 0.95, 
                pixelRatio: 2,
                backgroundColor: '#ffffff' // Force white background
            });

            // Créer le PDF au format A4
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Calculer les dimensions pour conserver le ratio, sans dépasser la page
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            const ratio = element.offsetWidth / element.offsetHeight;
            
            let imgWidth = pdfPageWidth;
            let imgHeight = pdfPageWidth / ratio;

            if (imgHeight > pdfPageHeight) {
                imgHeight = pdfPageHeight;
                imgWidth = imgHeight * ratio;
            }

            const x = (pdfPageWidth - imgWidth) / 2;
            const y = (pdfPageHeight - imgHeight) / 2;

            // Ajouter l'image au PDF et sauvegarder
            pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`astropass-${ticketId}.pdf`);

            // Incrémente le compteur en base de données de manière asynchrone
            await incrementDownloadCountAction(ticketId);
            setLocalCount(prev => prev + 1);
        } catch (error) {
            console.error("Erreur de génération PDF", error);
            alert("Erreur lors de la génération du billet.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!canDownload) {
        return (
            <Button disabled variant="outline" className="opacity-50 mt-8 cursor-not-allowed w-full">
                🔒 Téléchargement unique déjà effectué
            </Button>
        );
    }

    return (
        <Button onClick={handleDownload} disabled={isDownloading} className="mt-8 w-full" size="lg">
            {isDownloading ? 'Génération du PDF en cours...' : '⬇️ Télécharger mon Billet (PDF)'}
        </Button>
    );
}
