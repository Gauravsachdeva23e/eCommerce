"use client"

import { useState } from "react"
import { addAddress } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function AddressForm({ onSuccess }: { onSuccess?: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)

        try {
            const result = await addAddress(formData)
            if (result.success) {
                e.currentTarget.reset()
                onSuccess?.()
            } else {
                setError(result.error || "Failed to add address")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="houseNumber">House No. / Flat</Label>
                    <Input id="houseNumber" name="houseNumber" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="locality">Locality / Area</Label>
                    <Input id="locality" name="locality" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input id="landmark" name="landmark" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required pattern="[A-Za-z\s]+" title="Alphabets only" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" required pattern="[0-9]{6}" title="6 digit pincode" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Address
            </Button>
        </form>
    )
}
