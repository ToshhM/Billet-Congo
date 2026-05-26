import { NextResponse } from 'next/server';
import { paymentService } from '@/features/checkout/services/payment.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        console.log("PawaPay Webhook received:", JSON.stringify(body));

        const { depositId, status, failureReason } = body;

        if (!depositId || !status) {
            return NextResponse.json({ error: 'Missing depositId or status' }, { status: 400 });
        }

        let success = false;

        if (status === 'COMPLETED') {
            success = await paymentService.fulfillOrder(depositId);
            console.log(`Order fulfillment status for ${depositId}: ${success}`);
        } else if (status === 'FAILED') {
            success = await paymentService.failOrder(depositId, failureReason);
            console.log(`Order failure handling status for ${depositId}: ${success}`);
        } else {
            console.warn(`Unhandled PawaPay webhook status: ${status} for depositId: ${depositId}`);
            // Return 200 to acknowledge receipt of other statuses (e.g. processing/pending if sent)
            return NextResponse.json({ received: true, ignored: true });
        }

        return NextResponse.json({ received: true, processed: success });
    } catch (error) {
        console.error('Error handling PawaPay webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
