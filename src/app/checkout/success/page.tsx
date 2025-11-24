"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/context/CartContext"

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order_id")
    const { clearCart } = useCart()

    useEffect(() => {
        if (orderId) {
            clearCart()
        }
    }, [orderId, clearCart])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
            <p className="mb-8 text-muted-foreground">
                Thank you for your purchase. Your order ID is <span className="font-mono font-bold">{orderId}</span>.
            </p>
            <Link href="/">
                <Button>
                    Return to Home
                </Button>
            </Link>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
