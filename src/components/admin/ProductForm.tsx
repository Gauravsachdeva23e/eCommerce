"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Product } from "@/lib/data"
import { updateProduct, createProduct } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, X } from "lucide-react"
import { ImageUpload } from "./ImageUpload"

import { Category } from "@/lib/db"

interface ProductFormProps {
    product?: Product
    categories?: Category[]
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Product>>(
        product || {
            name: "",
            price: 0,
            description: "",
            image: "",
            category: "",
            features: [],
            isFeatured: false,
            isNew: false,
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? (value === "" ? 0 : parseFloat(value)) : value,
        }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }))
    }

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const features = e.target.value.split("\n").filter((f) => f.trim() !== "")
        setFormData((prev) => ({
            ...prev,
            features,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (product) {
                await updateProduct({ ...product, ...formData } as Product)
            } else {
                await createProduct({
                    ...formData,
                    id: Math.random().toString(36).substr(2, 9),
                } as Product)
            }
            router.push("/admin/products")
            router.refresh()
        } catch (error) {
            console.error("Error saving product:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => {
                            setFormData(prev => ({ ...prev, category: value }))
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Product Image</Label>
                    <ImageUpload
                        value={formData.image || ""}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        onRemove={() => setFormData(prev => ({ ...prev, image: "" }))}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea
                        id="features"
                        name="features"
                        value={formData.features?.join("\n")}
                        onChange={handleFeaturesChange}
                        rows={5}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleCheckboxChange("isFeatured", checked as boolean)}
                    />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isNew"
                        checked={formData.isNew}
                        onCheckedChange={(checked) => handleCheckboxChange("isNew", checked as boolean)}
                    />
                    <Label htmlFor="isNew">New Arrival</Label>
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? "Update Product" : "Create Product"}
            </Button>
        </form>
    )
}
