"use client"

import { MapPin, Clock, Share2, Flag, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatAction from "./ChatAction"

interface ProductInfoProps {
    title: string
    price: number
    description: string
    location: string
    postedDate: string
    category: string
    condition: string
    seller: {
        name: string
        avatar: string // URL or initials
        joinedDate: string
        rating: number
    }
}

export default function ProductInfo({
    title,
    price,
    description,
    location,
    postedDate,
    category,
    condition,
    seller
}: ProductInfoProps) {
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
                    {price.toLocaleString('fr-CM')} XAF
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Posted {postedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {location}
                    </span>
                </div>
            </div>

            {/* Quick Actions / Safety Flow */}
            <div className="p-4 bg-card border rounded-xl shadow-sm space-y-4">
                <ChatAction sellerName={seller.name} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div>
                    <span className="text-muted-foreground text-sm block">Condition</span>
                    <span className="font-medium">{condition}</span>
                </div>
                <div>
                    <span className="text-muted-foreground text-sm block">Category</span>
                    <span className="font-medium">{category}</span>
                </div>
            </div>

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
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {seller.avatar}
                    </div>
                    <div>
                        <div className="font-bold">{seller.name}</div>
                        <div className="text-sm text-muted-foreground">Joined {seller.joinedDate}</div>
                    </div>
                    <div className="ml-auto">
                        <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
                            View Profile
                        </Button>
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
