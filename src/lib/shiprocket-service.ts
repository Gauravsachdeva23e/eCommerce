import axios from "axios";
import { prisma } from "@/lib/prisma";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export class ShiprocketService {
    private static async getCredentials() {
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be set in .env");
        }
        return { email, password };
    }

    private static async login() {
        const { email, password } = await this.getCredentials();
        try {
            console.log("Authenticating with Shiprocket...");
            const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
                email,
                password
            });

            const token = response.data.token;
            // Token is valid for 10 days (approx). Let's set expiry to 9 days to be safe.
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 9);

            // Cache token and expiry in DB
            await prisma.systemSetting.upsert({
                where: { key: 'shiprocket_token' },
                update: { value: token },
                create: { key: 'shiprocket_token', value: token, description: 'Shiprocket Bearer Token' }
            });

            await prisma.systemSetting.upsert({
                where: { key: 'shiprocket_token_expiry' },
                update: { value: expiry.toISOString() },
                create: { key: 'shiprocket_token_expiry', value: expiry.toISOString(), description: 'Token Expiry' }
            });

            return token;
        } catch (error: any) {
            console.error("Shiprocket Login Failed:", error.response?.data || error.message);
            throw new Error("Failed to authenticate with Shiprocket");
        }
    }

    public static async getToken() {
        // 1. Try to get from DB
        const tokenSetting = await prisma.systemSetting.findUnique({ where: { key: 'shiprocket_token' } });
        const expirySetting = await prisma.systemSetting.findUnique({ where: { key: 'shiprocket_token_expiry' } });

        if (tokenSetting?.value && expirySetting?.value) {
            const expiry = new Date(expirySetting.value);
            const now = new Date();
            // If token is valid (not expired and not expiring in next 5 mins)
            if (expiry > now && (expiry.getTime() - now.getTime()) > 5 * 60 * 1000) {
                return tokenSetting.value;
            }
        }

        // 2. If missing or expired, login
        return await this.login();
    }

    public static async createOrder(orderData: any) {
        try {
            const token = await this.getToken();
            const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/ad-hoc`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            // If 401 Unauthorized, maybe token expired unexpectedly. Retry once.
            if (error.response?.status === 401) {
                console.warn("Shiprocket Token expired (401). Refreshing and retrying...");
                const newToken = await this.login();
                const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/ad-hoc`, orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    }
                });
                return response.data;
            }

            console.error("Shiprocket Create Order Error:", error.response?.data || error.message);
            throw error;
        }
    }
}
