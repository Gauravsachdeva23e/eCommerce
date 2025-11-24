import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="fixed inset-0 flex h-screen w-full overflow-hidden bg-muted/40">
            <AdminSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
