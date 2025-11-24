"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Review } from "@/lib/data"
import { submitReview } from "@/app/actions"
import { cn } from "@/lib/utils"

interface ProductReviewsProps {
    productId: string
    reviews: Review[]
}

export function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rating, setRating] = useState(5)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [showForm, setShowForm] = useState(false)

    const approvedReviews = reviews.filter(r => r.status === 'approved')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        try {
            await submitReview({
                productId,
                userName: formData.get('name') as string,
                rating,
                comment: formData.get('comment') as string,
            })
            setShowForm(false)
            alert("Review submitted successfully! It will appear after approval.")
        } catch (error) {
            console.error("Failed to submit review:", error)
            alert("Failed to submit review. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Write a Review"}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4 bg-card">
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={cn(
                                            "h-6 w-6 transition-colors",
                                            (hoveredRating || rating) >= star
                                                ? "fill-secondary text-secondary"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required placeholder="Your name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Review</Label>
                        <Textarea
                            id="comment"
                            name="comment"
                            required
                            placeholder="Share your thoughts about this product..."
                            rows={4}
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            )}

            <div className="space-y-6">
                {approvedReviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                        {reviews.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                                ({reviews.length} review{reviews.length > 1 ? 's' : ''} submitted, awaiting approval)
                            </p>
                        )}
                        <p className="text-[10px] text-gray-300 mt-4">Product ID: {productId}</p>
                    </div>
                ) : (
                    approvedReviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">{review.userName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(review.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-4 w-4",
                                            i < review.rating
                                                ? "fill-secondary text-secondary"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                            {review.reply && (
                                <div className="mt-4 ml-4 p-4 bg-muted rounded-lg">
                                    <div className="text-sm font-semibold mb-1">Response from Admin:</div>
                                    <p className="text-sm text-muted-foreground">{review.reply}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
