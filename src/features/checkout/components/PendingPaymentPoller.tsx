'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PendingPaymentPollerProps {
    orderId: string;
}

export default function PendingPaymentPoller({ orderId }: PendingPaymentPollerProps) {
    const router = useRouter();

    useEffect(() => {
        if (!orderId) return;

        console.log(`[Poller] Starting auto-check for order status: ${orderId}`);

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/checkout/status/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`[Poller] Checked status:`, data.status);
                    
                    if (data.status === 'COMPLETED') {
                        clearInterval(interval);
                        console.log(`[Poller] Order completed! Auto-refreshing page...`);
                        
                        // Use window.location to cleanly redirect and strip out "?pending=true&orderId=..."
                        window.location.href = '/account?success=true';
                    } else if (data.status === 'CANCELLED') {
                        clearInterval(interval);
                        console.log(`[Poller] Order cancelled/expired.`);
                        window.location.href = '/account?error=payment_failed';
                    }
                }
            } catch (e) {
                console.error('[Poller] Error polling order status:', e);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [orderId, router]);

    return null; // This is a helper UI component, it renders nothing
}
