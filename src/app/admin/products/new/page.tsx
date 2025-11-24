import { ProductForm } from "@/components/admin/ProductForm"
import { getSettings } from "@/lib/db"

export default async function NewProductPage() {
    const settings = await getSettings()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
                <p className="text-muted-foreground">
                    Add a new product to your catalog.
                </p>
            </div>
            <ProductForm categories={settings.categories} />
        </div>
    )
}
