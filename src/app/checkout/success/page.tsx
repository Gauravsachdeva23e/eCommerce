"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { verifyPayment } from "@/app/actions"

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId") || searchParams.get("order_id")
    const { clearCart } = useCart()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

    useEffect(() => {
        if (orderId) {
            verifyPayment(orderId).then((result) => {
                if (result.success) {
                    setStatus('success')
                    clearCart()
                } else {
                    setStatus('failed')
                }
            })
        }
    }, [orderId, clearCart])

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h1 className="mt-4 text-2xl font-bold">Verifying Payment...</h1>
            </div>
        )
    }

    if (status === 'failed') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 rounded-full bg-red-100 p-6 text-red-600">
                    <XCircle className="h-12 w-12" />
                </div>
                <h1 className="mb-2 text-3xl font-bold">Payment Verification Failed</h1>
                <p className="mb-8 text-muted-foreground">
                    We couldn't verify your payment. If you were charged, please contact support.
                </p>
                <div className="flex gap-4">
                    <Link href="/contact">
                        <Button variant="outline">Contact Support</Button>
                    </Link>
                    <Link href="/checkout">
                        <Button>Try Again</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="mb-8 text-muted-foreground">
                Thank you for your purchase. Your order ID is <span className="font-mono font-bold">{orderId}</span>.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">
                        Return to Home
                    </Button>
                </Link>
                <Link href="/profile">
                    <Button>
                        View My Orders
                    </Button>
                </Link>
            </div>
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
