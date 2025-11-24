"use client"

import { useState, useEffect } from "react"
import { fetchProducts, updateReviewStatus, replyToReview, deleteReview, togglePinReview } from "@/app/actions"
import { Product, Review } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, Trash2, MessageSquare, Check, X, Pin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExtendedReview extends Review {
    productName: string
    productImage: string
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<ExtendedReview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")

    const loadReviews = async () => {
        setIsLoading(true)
        try {
            const products = await fetchProducts()
            const allReviews: ExtendedReview[] = []

            products.forEach(product => {
                if (product.reviews) {
                    product.reviews.forEach(review => {
                        allReviews.push({
                            ...review,
                            productName: product.name,
                            productImage: product.image
                        })
                    })
                }
            })

            // Sort by date desc
            allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setReviews(allReviews)
        } catch (error) {
            console.error("Failed to load reviews:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadReviews()
    }, [])

    const handleStatusUpdate = async (productId: string, reviewId: string, status: 'approved' | 'rejected') => {
        await updateReviewStatus(productId, reviewId, status)
        loadReviews()
    }

    const handleDelete = async (productId: string, reviewId: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            await deleteReview(productId, reviewId)
            loadReviews()
        }
    }

    const handleReply = async (productId: string, reviewId: string) => {
        if (!replyText.trim()) return
        await replyToReview(productId, reviewId, replyText)
        setReplyingTo(null)
        setReplyText("")
        loadReviews()
    }

    const handleTogglePin = async (productId: string, reviewId: string) => {
        await togglePinReview(productId, reviewId)
        loadReviews()
    }

    if (isLoading) return <div className="p-8">Loading reviews...</div>

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reviews Management</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <img src={review.productImage} alt="" className="h-8 w-8 rounded object-cover" />
                                            <span className="truncate max-w-[150px]" title={review.productName}>{review.productName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{review.userName}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "h-3 w-3",
                                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="text-sm">{review.comment}</p>
                                        {review.reply && (
                                            <div className="mt-2 text-xs bg-muted p-2 rounded">
                                                <span className="font-semibold">Reply:</span> {review.reply}
                                            </div>
                                        )}
                                        {replyingTo === review.id && (
                                            <div className="mt-2 flex gap-2">
                                                <Textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your reply..."
                                                    className="h-20 text-xs"
                                                />
                                                <div className="flex flex-col gap-2">
                                                    <Button size="sm" onClick={() => handleReply(review.productId, review.id)}>Send</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            review.status === 'approved' ? 'default' :
                                                review.status === 'rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {review.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {review.status === 'pending' && (
                                                <>
                                                    <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(review.productId, review.id, 'approved')} title="Approve">
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(review.productId, review.id, 'rejected')} title="Reject">
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="icon" variant="ghost" onClick={() => setReplyingTo(review.id)} title="Reply">
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleTogglePin(review.productId, review.id)}
                                                title={review.isPinned ? "Unpin from Home" : "Pin to Home"}
                                                className={cn(
                                                    "transition-all duration-300 hover:scale-110",
                                                    review.isPinned ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-muted-foreground hover:text-blue-600"
                                                )}
                                            >
                                                <Pin className={cn("h-4 w-4 transition-transform", review.isPinned && "fill-current rotate-45")} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(review.productId, review.id)} title="Delete">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
