"use client"

import React, { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { cn } from "@/lib/utils"
import { load } from '@cashfreepayments/cashfree-js';
import { initiatePayment } from "@/app/actions";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const router = useRouter()

    const handleCheckout = async () => {
        setIsCheckingOut(true)
        try {
            const customerData = {
                name: "Guest User",
                email: "guest@example.com",
                phone: "9999999999"
            }

            const result = await initiatePayment(totalPrice, customerData, items)

            if (result.success && result.payment_session_id) {
                const cashfree = await load({
                    mode: "sandbox"
                })

                await cashfree.checkout({
                    paymentSessionId: result.payment_session_id,
                    returnUrl: `http://localhost:3000/checkout/success?order_id=${result.order_id}`
                })

                // Note: The user will be redirected, so we don't need to clear cart here immediately
                // But for better UX if they come back or if it opens in new tab (it doesn't usually),
                // we might want to handle cart clearing on success page.
                // For now, we leave the cart as is until success.
                onClose()
            } else {
                alert("Failed to initiate payment: " + result.error)
            }
        } catch (error) {
            console.error("Checkout error:", error)
            alert("An error occurred during checkout.")
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-xl transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">Shopping Cart</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                                <div className="text-muted-foreground">Your cart is empty</div>
                                <Button onClick={() => {
                                    router.push('/shop')
                                    onClose()
                                }}>Continue Shopping</Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="font-semibold">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 rounded-md border p-1">
                                                    <button
                                                        className="p-1 hover:bg-muted rounded"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-4 text-center text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="p-1 hover:bg-muted rounded"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="border-t p-4">
                            <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? "Processing..." : "Checkout"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
