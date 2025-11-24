import { NextResponse } from 'next/server';
import { getPaymentSettings, savePaymentSettings } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function GET() {
    const settings = await getPaymentSettings();

    // Mask secrets for security
    const maskedSettings = {
        ...settings,
        sandbox_client_id: settings.sandbox_client_id ? '********' : '',
        sandbox_client_secret: settings.sandbox_client_secret ? '********' : '',
        live_client_id: settings.live_client_id ? '********' : '',
        live_client_secret: settings.live_client_secret ? '********' : '',
    };

    return NextResponse.json(maskedSettings);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const currentSettings = await getPaymentSettings();

        // Encrypt secrets if they are provided (not masked)
        // If masked (********), keep the existing value
        const newSettings = {
            ...currentSettings,
            ...data,
            updated_at: new Date().toISOString()
        };

        if (data.sandbox_client_id && data.sandbox_client_id !== '********') {
            newSettings.sandbox_client_id = encrypt(data.sandbox_client_id);
        } else {
            newSettings.sandbox_client_id = currentSettings.sandbox_client_id;
        }

        if (data.sandbox_client_secret && data.sandbox_client_secret !== '********') {
            newSettings.sandbox_client_secret = encrypt(data.sandbox_client_secret);
        } else {
            newSettings.sandbox_client_secret = currentSettings.sandbox_client_secret;
        }

        if (data.live_client_id && data.live_client_id !== '********') {
            newSettings.live_client_id = encrypt(data.live_client_id);
        } else {
            newSettings.live_client_id = currentSettings.live_client_id;
        }

        if (data.live_client_secret && data.live_client_secret !== '********') {
            newSettings.live_client_secret = encrypt(data.live_client_secret);
        } else {
            newSettings.live_client_secret = currentSettings.live_client_secret;
        }

        await savePaymentSettings(newSettings);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save payment settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
    }
}
