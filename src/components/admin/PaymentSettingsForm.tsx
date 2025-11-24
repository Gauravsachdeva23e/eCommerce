"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Eye, EyeOff, Save, CheckCircle, HelpCircle, RefreshCw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PaymentSettings {
    mode: 'sandbox' | 'live';
    sandbox_client_id: string;
    sandbox_client_secret: string;
    live_client_id: string;
    live_client_secret: string;
    callback_url: string;
    webhook_url: string;
    updated_at: string;
}

export function PaymentSettingsForm() {
    const [settings, setSettings] = useState<PaymentSettings>({
        mode: 'sandbox',
        sandbox_client_id: '',
        sandbox_client_secret: '',
        live_client_id: '',
        live_client_secret: '',
        callback_url: '',
        webhook_url: '',
        updated_at: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showSecrets, setShowSecrets] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/payment-settings')
            if (res.ok) {
                const data = await res.json()
                setSettings(data)
            }
        } catch (error) {
            console.error("Failed to load settings", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        // Validation
        if (settings.mode === 'live') {
            if (!settings.live_client_id || !settings.live_client_secret) {
                setMessage({ type: 'error', text: 'Live keys are required when switching to Live mode.' })
                setSaving(false)
                return
            }
        }

        try {
            const res = await fetch('/api/payment-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully.' })
                fetchSettings() // Reload to get updated timestamp and masked keys
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof PaymentSettings, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Cashfree Payment Settings
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Switch Mode → backend will automatically pick the right keys; no code edits required.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
                <CardDescription>
                    Configure your Cashfree Payment Gateway credentials.
                    {settings.updated_at && <span className="ml-2 text-xs text-muted-foreground">Last updated: {new Date(settings.updated_at).toLocaleString()}</span>}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-6">

                    {/* Mode Switch */}
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                            <Label className="text-base">Payment Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Toggle between Sandbox (Test) and Live (Production).
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${settings.mode === 'sandbox' ? 'text-primary' : 'text-muted-foreground'}`}>Sandbox</span>
                            <Switch
                                checked={settings.mode === 'live'}
                                onCheckedChange={(checked) => handleChange('mode', checked ? 'live' : 'sandbox')}
                            />
                            <span className={`text-sm font-medium ${settings.mode === 'live' ? 'text-destructive' : 'text-muted-foreground'}`}>Live</span>
                        </div>
                    </div>

                    {settings.mode === 'live' && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Warning: Live Mode Active</AlertTitle>
                            <AlertDescription>
                                Live mode will process real payments. Please verify your credentials and webhook URL.
                            </AlertDescription>
                        </Alert>
                    )}

                    {message && (
                        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className={message.type === 'success' ? 'border-green-500 text-green-600' : ''}>
                            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                            <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}

                    {/* Sandbox Keys */}
                    <div className={`space-y-4 rounded-md border p-4 ${settings.mode === 'sandbox' ? 'bg-muted/50' : 'opacity-50'}`}>
                        <h3 className="font-medium">Sandbox Credentials</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="sandbox_id">App ID</Label>
                            <Input
                                id="sandbox_id"
                                value={settings.sandbox_client_id}
                                onChange={(e) => handleChange('sandbox_client_id', e.target.value)}
                                placeholder="TEST..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sandbox_secret">Secret Key</Label>
                            <div className="relative">
                                <Input
                                    id="sandbox_secret"
                                    type={showSecrets ? "text" : "password"}
                                    value={settings.sandbox_client_secret}
                                    onChange={(e) => handleChange('sandbox_client_secret', e.target.value)}
                                    placeholder="cfsk_..."
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowSecrets(!showSecrets)}
                                >
                                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Live Keys */}
                    <div className={`space-y-4 rounded-md border p-4 ${settings.mode === 'live' ? 'bg-destructive/5 border-destructive/20' : 'opacity-50'}`}>
                        <h3 className="font-medium">Live Credentials</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="live_id">App ID</Label>
                            <Input
                                id="live_id"
                                value={settings.live_client_id}
                                onChange={(e) => handleChange('live_client_id', e.target.value)}
                                placeholder="Enter Live App ID"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="live_secret">Secret Key</Label>
                            <div className="relative">
                                <Input
                                    id="live_secret"
                                    type={showSecrets ? "text" : "password"}
                                    value={settings.live_client_secret}
                                    onChange={(e) => handleChange('live_client_secret', e.target.value)}
                                    placeholder="Enter Live Secret Key"
                                />
                            </div>
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="callback_url">Callback URL</Label>
                            <Input
                                id="callback_url"
                                value={settings.callback_url}
                                onChange={(e) => handleChange('callback_url', e.target.value)}
                                placeholder="https://yourdomain.com/checkout/success"
                            />
                            <p className="text-xs text-muted-foreground">Where users are redirected after payment.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="webhook_url">Webhook URL</Label>
                            <Input
                                id="webhook_url"
                                value={settings.webhook_url}
                                readOnly
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Configure this URL in your Cashfree Dashboard.</p>
                        </div>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Settings
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
