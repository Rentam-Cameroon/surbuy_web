"use client"

import { MapPin, Clock, Share2, Flag, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatAction from "./ChatAction"

interface ProductInfoProps {
    title: string
    price: number | string
    description: string
    location?: string
    postedDate?: string
    category?: string
    condition?: string
    productId: string
    conversationId?: string | null
    isConversationLoading?: boolean
    seller: {
        name: string
        avatar: string // initials fallback
        avatarUrl?: string | null
        joinedDate: string
        rating: number
        badgeLabel?: string
        badgeClassName?: string
    }
    onSellerClick?: () => void
}

export default function ProductInfo({
    title,
    price,
    description,
    location,
    postedDate,
    category,
    condition,
    productId,
    conversationId,
    isConversationLoading,
    seller,
    onSellerClick
}: ProductInfoProps) {
    const resolvedPrice = typeof price === "string" ? Number(price) : price

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
                <div className="text-3xl font-extrabold text-primary mt-2">
                    {Number.isFinite(resolvedPrice) ? resolvedPrice.toLocaleString('fr-CM') : 0} XAF
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                    {postedDate && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Posted {postedDate}
                        </span>
                    )}
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {location}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Actions / Safety Flow */}
            <div className="p-4 bg-card border rounded-xl shadow-sm space-y-4">
                <ChatAction
                    sellerName={seller.name}
                    productId={productId}
                    existingConversationId={conversationId}
                    disabled={isConversationLoading}
                />
            </div>

            {/* Details Grid */}
            {(condition || category) && (
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                    {condition && (
                        <div>
                            <span className="text-muted-foreground text-sm block">Condition</span>
                            <span className="font-medium">{condition}</span>
                        </div>
                    )}
                    {category && (
                        <div>
                            <span className="text-muted-foreground text-sm block">Category</span>
                            <span className="font-medium">{category}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Description */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Seller Info */}
            <div className="pt-4 border-t border-border/50">
                <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
                <div className="flex items-center gap-4" onClick={onSellerClick}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                        {seller.avatarUrl ? (
                            <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />
                        ) : (
                            seller.avatar
                        )}
                    </div>
                    <div>
                        <div className="font-bold flex items-center gap-2">
                            <span>{seller.name}</span>
                            {seller.badgeLabel && (
                                <span className={seller.badgeClassName}>
                                    {seller.badgeLabel}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">Joined {seller.joinedDate}</div>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Identity Verified</span>
                </div>
            </div>

            <div className="pt-4">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-red-500 gap-2">
                    <Flag className="w-4 h-4" />
                    Report this listing
                </Button>
            </div>
        </div>
    )
}
