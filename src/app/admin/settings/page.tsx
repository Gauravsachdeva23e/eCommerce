import { fetchSettings } from "@/app/actions"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function AdminSettingsPage() {
    const settings = await fetchSettings()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage global website settings.
                </p>
            </div>
            <SettingsForm initialSettings={settings} />
        </div>
    )
}
