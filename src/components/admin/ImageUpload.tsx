"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadMedia } from "@/app/actions"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    onRemove: () => void
    disabled?: boolean
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Client-side Validation
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > MAX_SIZE) {
            alert("File size exceeds 5MB limit.");
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
            return;
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const result = await uploadMedia(formData)
            if (result.success && result.url) {
                onChange(result.url)
            } else {
                console.error("Upload failed:", result.error)
                alert(result.error || "Upload failed. Please try again.")
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Error uploading image.")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <div className="flex items-center gap-4">
            <div
                className={`relative w-40 h-40 border rounded-lg overflow-hidden bg-muted flex items-center justify-center ${value ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                onClick={() => value && window.open(value, '_blank')}
            >
                {value ? (
                    <>
                        <Image
                            src={value}
                            alt="Upload"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove()
                                }}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                )}
            </div>
            <div className="space-y-2">
                <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    disabled={disabled || isUploading}
                />
                <Button
                    type="button"
                    variant="secondary"
                    disabled={disabled || isUploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                        </>
                    )}
                </Button>
                <p className="text-xs text-muted-foreground">
                    Max 5MB. Formats: JPG, PNG, WEBP.
                </p>
            </div>
        </div>
    )
}
