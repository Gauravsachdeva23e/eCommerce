"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { placeOrder, initiatePayment } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { AddressForm } from "./AddressForm"
import { load } from "@cashfreepayments/cashfree-js"

interface Address {
    id: string
    houseNumber: string
    locality: string
    city: string
    state: string
    pincode: string
    landmark?: string | null
}

export function CheckoutForm({ addresses }: { addresses: Address[] }) {
    const { items, totalPrice, clearCart } = useCart()
    const [selectedAddress, setSelectedAddress] = useState<string>(addresses[0]?.id || "")
    const [isProcessing, setIsProcessing] = useState(false)
    const [showAddAddress, setShowAddAddress] = useState(false)
    const router = useRouter()

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
            </div>
        )
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return alert("Please select an address")

        setIsProcessing(true)
        try {
            // 1. Initiate Payment
            const result = await initiatePayment(totalPrice, {
                id: "user_id_placeholder", // Ideally passed from props or context
                name: "User Name",
                email: "user@example.com",
                phone: "9999999999"
            }, items)

            if (result.success && result.payment_session_id) {
                // 2. Load Cashfree SDK
                const cashfree = await load({
                    mode: result.mode === "sandbox" ? "sandbox" : "production"
                })

                // 3. Checkout
                cashfree.checkout({
                    paymentSessionId: result.payment_session_id,
                    returnUrl: `${window.location.origin}/checkout/success?orderId=${result.order_id}`
                })
            } else {
                alert(result.error || "Failed to initiate payment")
                setIsProcessing(false)
            }
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Something went wrong")
            setIsProcessing(false)
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Shipping Address</h2>
                            <Button variant="outline" size="sm" onClick={() => setShowAddAddress(!showAddAddress)}>
                                {showAddAddress ? "Cancel" : "Add New Address"}
                            </Button>
                        </div>

                        {showAddAddress ? (
                            <AddressForm onSuccess={() => {
                                setShowAddAddress(false)
                                router.refresh()
                            }} />
                        ) : (
                            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                                {addresses.map((addr) => (
                                    <div key={addr.id} className="flex items-start space-x-2 border p-4 rounded-md mb-2">
                                        <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                                        <Label htmlFor={addr.id} className="cursor-pointer flex-1">
                                            <div className="font-medium">{addr.houseNumber}, {addr.locality}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {addr.landmark && <span>{addr.landmark}, </span>}
                                                {addr.city}, {addr.state} - {addr.pincode}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {addresses.length === 0 && !showAddAddress && (
                            <p className="text-muted-foreground text-center py-4">
                                No addresses found. Please add one.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card className="sticky top-20">
                    <CardContent className="pt-6 space-y-4">
                        <h2 className="text-xl font-semibold">Order Summary</h2>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || !selectedAddress || items.length === 0}
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order (Pay Now)
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            By placing order, you agree to our Terms & Conditions.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
