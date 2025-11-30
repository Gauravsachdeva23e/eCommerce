"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateSettings, getShiprocketToken, updateShiprocketToken } from "@/app/actions"
import { Settings } from "@/lib/db"
import { Loader2, Plus, Trash, Save } from "lucide-react"
import { MediaUpload } from "./MediaUpload"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentSettingsForm } from "./PaymentSettingsForm"
import { useEffect } from "react"

interface SettingsFormProps {
    initialSettings: Settings
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState<Settings>(initialSettings)
    const [shiprocketToken, setShiprocketToken] = useState("")

    useEffect(() => {
        getShiprocketToken().then(setShiprocketToken)
    }, [])

    const handleSaveToken = async () => {
        setIsLoading(true)
        await updateShiprocketToken(shiprocketToken)
        setIsLoading(false)
        router.refresh()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await updateSettings(settings)
        setIsLoading(false)
        router.refresh()
    }

    const addCarouselSlide = () => {
        setSettings({
            ...settings,
            carouselSlides: [...settings.carouselSlides, { type: 'image', url: '' }]
        })
    }

    const removeCarouselSlide = (index: number) => {
        const newSlides = [...settings.carouselSlides]
        newSlides.splice(index, 1)
        setSettings({
            ...settings,
            carouselSlides: newSlides
        })
    }

    const updateCarouselSlide = (index: number, url: string, type: 'image' | 'video') => {
        const newSlides = [...settings.carouselSlides]
        newSlides[index] = { ...newSlides[index], url, type }
        setSettings({
            ...settings,
            carouselSlides: newSlides
        })
    }

    // ... existing code ...

    return (
        <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">General & Hero</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section Configuration</CardTitle>
                                <CardDescription>
                                    Manage the main banner on the home page. Supports Images and Videos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Display Type</Label>
                                    <RadioGroup
                                        defaultValue={settings.heroType}
                                        onValueChange={(value: 'static' | 'carousel') => setSettings({ ...settings, heroType: value })}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="static" id="static" />
                                            <Label htmlFor="static">Static Media (Image or Video)</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="carousel" id="carousel" />
                                            <Label htmlFor="carousel">Media Carousel</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {settings.heroType === 'static' ? (
                                    <div className="space-y-2">
                                        <Label>Hero Media</Label>
                                        <MediaUpload
                                            value={settings.staticMedia?.url}
                                            type={settings.staticMedia?.type}
                                            onChange={(url, type) => setSettings({ ...settings, staticMedia: { url, type } })}
                                            onRemove={() => setSettings({ ...settings, staticMedia: { url: "", type: 'image' } })}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Supported: JPG, PNG, WEBP, MP4, WEBM. Max 50MB.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Label>Carousel Slides</Label>
                                        {settings.carouselSlides.map((slide, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <MediaUpload
                                                    value={slide.url}
                                                    type={slide.type}
                                                    onChange={(url, type) => updateCarouselSlide(index, url, type)}
                                                    onRemove={() => removeCarouselSlide(index)}
                                                />
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" onClick={addCarouselSlide} className="w-full">
                                            <Plus className="mr-2 h-4 w-4" /> Add Slide
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            Add images or videos. Recommended: 1920x1080px.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Content Configuration</CardTitle>
                                <CardDescription>
                                    Customize the text and colors of the hero section.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="heroHeading">Hero Heading</Label>
                                    <Input
                                        id="heroHeading"
                                        value={settings.heroHeading}
                                        onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                                        placeholder="Timeless Elegance, Modern Precision."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="heroSubheading">Hero Subheading</Label>
                                    <Input
                                        id="heroSubheading"
                                        value={settings.heroSubheading}
                                        onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                                        placeholder="Discover our curated collection..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                                        <Input
                                            id="primaryButtonText"
                                            value={settings.primaryButtonText}
                                            onChange={(e) => setSettings({ ...settings, primaryButtonText: e.target.value })}
                                            placeholder="Shop Collection"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
                                        <Input
                                            id="secondaryButtonText"
                                            value={settings.secondaryButtonText}
                                            onChange={(e) => setSettings({ ...settings, secondaryButtonText: e.target.value })}
                                            placeholder="Our Story"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gradientColor">Gradient Overlay Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="gradientColor"
                                            type="color"
                                            value={settings.gradientOverlayColor?.slice(0, 7) || "#ffa700"}
                                            onChange={(e) => setSettings({ ...settings, gradientOverlayColor: e.target.value + "40" })}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            value={settings.gradientOverlayColor}
                                            onChange={(e) => setSettings({ ...settings, gradientOverlayColor: e.target.value })}
                                            placeholder="#ffa70040"
                                            className="flex-1"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Select a color or enter a HEX code (with alpha). Default: #ffa70040
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="footer">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Footer Configuration</CardTitle>
                                <CardDescription>
                                    Manage footer links and contact information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Shop Links */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Shop Links</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSettings({
                                                ...settings,
                                                footerShopLinks: [...(settings.footerShopLinks || []), { label: "New Link", url: "/" }]
                                            })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Link
                                        </Button>
                                    </div>
                                    {settings.footerShopLinks?.map((link, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => {
                                                    const newLinks = [...settings.footerShopLinks];
                                                    newLinks[index].label = e.target.value;
                                                    setSettings({ ...settings, footerShopLinks: newLinks });
                                                }}
                                                placeholder="Label"
                                                className="flex-1"
                                            />
                                            <Input
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...settings.footerShopLinks];
                                                    newLinks[index].url = e.target.value;
                                                    setSettings({ ...settings, footerShopLinks: newLinks });
                                                }}
                                                placeholder="URL"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const newLinks = [...settings.footerShopLinks];
                                                    newLinks.splice(index, 1);
                                                    setSettings({ ...settings, footerShopLinks: newLinks });
                                                }}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Company Links */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Company Links</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSettings({
                                                ...settings,
                                                footerCompanyLinks: [...(settings.footerCompanyLinks || []), { label: "New Link", url: "/" }]
                                            })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Link
                                        </Button>
                                    </div>
                                    {settings.footerCompanyLinks?.map((link, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => {
                                                    const newLinks = [...settings.footerCompanyLinks];
                                                    newLinks[index].label = e.target.value;
                                                    setSettings({ ...settings, footerCompanyLinks: newLinks });
                                                }}
                                                placeholder="Label"
                                                className="flex-1"
                                            />
                                            <Input
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...settings.footerCompanyLinks];
                                                    newLinks[index].url = e.target.value;
                                                    setSettings({ ...settings, footerCompanyLinks: newLinks });
                                                }}
                                                placeholder="URL"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    const newLinks = [...settings.footerCompanyLinks];
                                                    newLinks.splice(index, 1);
                                                    setSettings({ ...settings, footerCompanyLinks: newLinks });
                                                }}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4">
                                    <Label>Social Media Links</Label>
                                    {settings.footerSocialLinks?.map((link, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <div className="w-24 font-medium capitalize">{link.platform}</div>
                                            <Input
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...settings.footerSocialLinks];
                                                    newLinks[index].url = e.target.value;
                                                    setSettings({ ...settings, footerSocialLinks: newLinks });
                                                }}
                                                placeholder="URL (# to disable)"
                                                className="flex-1"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4 border-t pt-4">
                                    <Label className="text-lg font-semibold">Contact Information</Label>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Address (Multiline)</Label>
                                            <textarea
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={settings.footerAddress}
                                                onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input
                                                    value={settings.footerPhone}
                                                    onChange={(e) => setSettings({ ...settings, footerPhone: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    value={settings.footerEmail}
                                                    onChange={(e) => setSettings({ ...settings, footerEmail: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="categories">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Management</CardTitle>
                                <CardDescription>
                                    Manage product categories, their images, and homepage visibility.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label>Categories</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newName = "New Category";
                                            const isDuplicate = settings.categories?.some(c => c.name.toLowerCase() === newName.toLowerCase());

                                            if (isDuplicate) {
                                                alert("A category with this name already exists. Please rename the existing 'New Category' before adding another.");
                                                return;
                                            }

                                            const newId = Math.random().toString(36).substr(2, 9);
                                            setSettings({
                                                ...settings,
                                                categories: [...(settings.categories || []), {
                                                    id: newId,
                                                    name: newName,
                                                    slug: "new-category-" + newId,
                                                    image: "",
                                                    showOnHome: false
                                                }]
                                            })
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Category
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {settings.categories && settings.categories.length > 0 ? (
                                        settings.categories.map((category, index) => (
                                            <div key={category.id} className="flex gap-4 items-start p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                                <div className="flex-shrink-0">
                                                    <Label className="mb-2 block text-xs text-muted-foreground">Image</Label>
                                                    <MediaUpload
                                                        value={category.image || ""}
                                                        onChange={(url) => {
                                                            const newCategories = [...settings.categories];
                                                            newCategories[index] = { ...category, image: url };
                                                            setSettings({ ...settings, categories: newCategories });
                                                        }}
                                                        onRemove={() => {
                                                            const newCategories = [...settings.categories];
                                                            newCategories[index] = { ...category, image: "" };
                                                            setSettings({ ...settings, categories: newCategories });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 grid gap-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={category.name}
                                                                onChange={(e) => {
                                                                    const newCategories = [...settings.categories];
                                                                    newCategories[index] = {
                                                                        ...category,
                                                                        name: e.target.value,
                                                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                                                    };
                                                                    setSettings({ ...settings, categories: newCategories });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Slug</Label>
                                                            <Input
                                                                value={category.slug}
                                                                onChange={(e) => {
                                                                    const newCategories = [...settings.categories];
                                                                    newCategories[index] = { ...category, slug: e.target.value };
                                                                    setSettings({ ...settings, categories: newCategories });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`showOnHome-${category.id}`}
                                                                checked={category.showOnHome}
                                                                onCheckedChange={(checked) => {
                                                                    const newCategories = [...settings.categories];
                                                                    newCategories[index] = { ...category, showOnHome: checked as boolean };
                                                                    setSettings({ ...settings, categories: newCategories });
                                                                }}
                                                            />
                                                            <Label htmlFor={`showOnHome-${category.id}`}>Show on Homepage</Label>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newCategories = [...settings.categories];
                                                                newCategories.splice(index, 1);
                                                                setSettings({ ...settings, categories: newCategories });
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                            No categories found. Click "Add Category" to create one.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="payment">
                    <PaymentSettingsForm />
                </TabsContent>

                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Configuration</CardTitle>
                            <CardDescription>
                                Manage your Shiprocket integration settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shiprocketToken">Shiprocket Bearer Token</Label>
                                <Input
                                    id="shiprocketToken"
                                    type="password"
                                    value={shiprocketToken}
                                    onChange={(e) => setShiprocketToken(e.target.value)}
                                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                />
                                <p className="text-sm text-muted-foreground">
                                    Enter your Shiprocket Bearer Token here. This will be used for all shipping operations.
                                </p>
                            </div>
                            <Button onClick={handleSaveToken} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Token
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
