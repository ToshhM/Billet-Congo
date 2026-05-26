import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const resolvedParams = await params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: resolvedParams.orderId },
            select: { status: true }
        });
        
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        
        return NextResponse.json({ status: order.status });
    } catch (e) {
        console.error('Error fetching order status:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
