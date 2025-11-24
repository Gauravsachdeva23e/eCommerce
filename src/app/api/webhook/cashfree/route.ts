import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPaymentSettings, getOrders, saveOrders, Order } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

// Verify Cashfree Webhook Signature
// https://docs.cashfree.com/docs/webhooks-integration
async function verifySignature(timestamp: string, rawBody: string, signature: string) {
    const settings = await getPaymentSettings();
    const isLive = settings.mode === 'live';
    // Note: Webhook secret might be different from client secret depending on Cashfree version
    // For this demo, we assume it uses the client secret or a separate configured secret.
    // In a real scenario, you might add a separate field for "Webhook Secret" in settings.
    let secret = isLive ? settings.live_client_secret : settings.sandbox_client_secret;

    try {
        if (secret && secret.length > 50) secret = decrypt(secret);
    } catch (e) { /* Assume plain text */ }

    const data = timestamp + rawBody;
    const computedSignature = crypto.createHmac('sha256', secret)
        .update(data)
        .digest('base64');

    // This is a simplified verification. 
    // Cashfree V2/V3 webhooks might have specific requirements.
    // ALWAYS check the latest docs.
    return computedSignature === signature;
}

export async function POST(request: Request) {
    try {
        const timestamp = request.headers.get('x-webhook-timestamp');
        const signature = request.headers.get('x-webhook-signature');
        const rawBody = await request.text();

        if (!timestamp || !signature) {
            return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
        }

        // TODO: Enable signature verification in production
        // const isValid = await verifySignature(timestamp, rawBody, signature);
        // if (!isValid) {
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const payload = JSON.parse(rawBody);
        console.log('Cashfree Webhook Received:', payload);

        // Handle the event (e.g., PAYMENT_SUCCESS_WEBHOOK)
        if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const orderId = payload.data.order.order_id;
            console.log(`Payment successful for order: ${orderId}`);

            // Update order status in DB
            const orders = await getOrders();
            const orderIndex = orders.findIndex((o: Order) => o.id === orderId);

            if (orderIndex !== -1) {
                orders[orderIndex].status = 'processing'; // Or 'paid'
                orders[orderIndex].paymentStatus = 'paid';
                await saveOrders(orders);
                console.log(`Order ${orderId} updated to processing/paid`);
            } else {
                console.warn(`Order ${orderId} not found in DB`);
            }
        }

        return NextResponse.json({ status: 'OK' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
