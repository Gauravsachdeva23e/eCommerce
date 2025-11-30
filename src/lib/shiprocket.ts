import axios from "axios"

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external"

import { getShiprocketToken } from "@/app/actions"

async function getHeaders() {
    const token = await getShiprocketToken()
    if (!token) {
        throw new Error("SHIPROCKET_BEARER_TOKEN is missing in settings")
    }
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }
}

export async function checkServiceability(pickupPincode: string, deliveryPincode: string, weight: number, cod: boolean) {
    try {
        const headers = await getHeaders()
        const response = await axios.get(`${SHIPROCKET_BASE_URL}/courier/serviceability/`, {
            headers,
            params: {
                pickup_postcode: pickupPincode,
                delivery_postcode: deliveryPincode,
                weight,
                cod: cod ? 1 : 0,
            },
        })
        return response.data
    } catch (error: any) {
        console.error("Shiprocket Serviceability Error:", error.response?.data || error.message)
        return null
    }
}

export async function createShiprocketOrder(orderData: any) {
    try {
        const headers = await getHeaders()
        const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/ad-hoc`, orderData, { headers })
        return response.data
    } catch (error: any) {
        console.error("Shiprocket Create Order Error:", error.response?.data || error.message)
        throw error
    }
}
