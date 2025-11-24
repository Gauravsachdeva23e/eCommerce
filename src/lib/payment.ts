import { getPaymentSettings } from './db';
import { decrypt } from './encryption';

export async function getActiveCashfreeConfig() {
    const settings = await getPaymentSettings();
    const isLive = settings.mode === 'live';

    const clientId = isLive ? settings.live_client_id : settings.sandbox_client_id;
    const clientSecret = isLive ? settings.live_client_secret : settings.sandbox_client_secret;

    // Decrypt keys if they are encrypted (check if they look like base64)
    // Note: In a real app, we'd ensure they are always encrypted in DB.
    // Here we handle potential plain text for backward compatibility/demo.
    let decryptedId = clientId;
    let decryptedSecret = clientSecret;

    try {
        if (clientId && clientId.length > 50) decryptedId = decrypt(clientId);
    } catch (e) { /* Assume plain text */ }

    try {
        if (clientSecret && clientSecret.length > 50) decryptedSecret = decrypt(clientSecret);
    } catch (e) { /* Assume plain text */ }

    return {
        baseUrl: isLive ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg',
        clientId: decryptedId,
        clientSecret: decryptedSecret,
        callbackUrl: settings.callback_url,
        apiVersion: '2023-08-01'
    };
}

export async function createCashfreeOrder(amount: number, customerData: any, orderId: string) {
    const config = await getActiveCashfreeConfig();

    const url = `${config.baseUrl}/orders`;
    const headers = {
        "x-client-id": config.clientId,
        "x-client-secret": config.clientSecret,
        "x-api-version": config.apiVersion,
        "Content-Type": "application/json"
    };

    const body = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: customerData.id || "guest_" + Date.now(),
            customer_name: customerData.name || "Guest",
            customer_email: customerData.email || "guest@example.com",
            customer_phone: customerData.phone || "9999999999"
        },
        order_meta: {
            return_url: `${config.callbackUrl}?order_id={order_id}`
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            console.error("Cashfree API Error:", data);
            return { success: false, error: data.message || "API Error" };
        }
    } catch (error: any) {
        console.error("Fetch Error:", error);
        return { success: false, error: error.message };
    }
}
