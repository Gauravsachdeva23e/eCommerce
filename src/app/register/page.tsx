"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/app/actions"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)

        try {
            const result = await registerUser(formData)
            if (result.success) {
                router.push("/login?registered=true")
            } else {
                setError(result.error || "Registration failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" required placeholder="9876543210" pattern="[0-9]{10}" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {password && (
                                <div className="text-xs space-y-1 mt-2 p-2 bg-muted rounded-md">
                                    <p className={password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                                        • At least 8 characters
                                    </p>
                                    <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                                        • At least one uppercase letter
                                    </p>
                                    <p className={/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                                        • At least one lowercase letter
                                    </p>
                                    <p className={/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                                        • At least one number
                                    </p>
                                    <p className={/[\W_]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                                        • At least one special character
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div >
    )
}
