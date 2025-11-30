"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileVideo, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadImage } from "@/app/actions"

interface MediaUploadProps {
    value?: string
    type?: 'image' | 'video'
    onChange: (url: string, type: 'image' | 'video') => void
    onRemove: () => void
}

export function MediaUpload({ value, type = 'image', onChange, onRemove }: MediaUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await uploadImage(formData)
            if (result.success && result.url) {
                onChange(result.url, 'image')
            } else {
                console.error("Upload failed:", result.error)
                alert("Upload failed: " + result.error)
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("Upload error occurred")
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className="relative w-full h-[200px] rounded-md overflow-hidden border bg-muted group">
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={onRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {type === 'video' ? (
                    <video
                        src={value}
                        className="w-full h-full object-cover"
                        controls
                    />
                ) : (
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        className="object-cover"
                    />
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
            />
            <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[200px] flex flex-col gap-2 border-dashed"
            >
                {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <div className="flex gap-2">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            <FileVideo className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground">Click to upload Image or Video</span>
                        <span className="text-xs text-muted-foreground/70">Max 50MB</span>
                    </>
                )}
            </Button>
        </div>
    )
}
