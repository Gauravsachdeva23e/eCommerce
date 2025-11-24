import { NextResponse } from 'next/server';
import { createCashfreeOrder } from '@/lib/payment';

export async function POST(request: Request) {
    try {
        // For demo purposes, we'll use a fixed amount and dummy customer
        // In a real app, this would come from the request body or cart context
        const amount = 1.00;
        const orderId = "DEMO_" + Date.now();
        const customerData = {
            id: "demo_user",
            name: "Demo User",
            email: "demo@example.com",
            phone: "9999999999"
        };

        const result = await createCashfreeOrder(amount, customerData, orderId);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error('Failed to create demo payment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
