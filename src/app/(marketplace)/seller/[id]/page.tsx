"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { marketplaceService } from "@/lib/marketplaceService"
import ListingCard from "@/components/marketplace/ListingCard"
import { useCachedData } from "@/hooks/useCachedData"

export default function SellerProfilePage() {
    const params = useParams()
    const router = useRouter()
    const sellerId = params?.id as string
    const [seller, setSeller] = useState<any | null>(null)
    const [products, setProducts] = useState<any[]>([])

    const getInitials = (name?: string) => {
        if (!name) return "S"
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getSellerBadge = (status?: string, tier?: number) => {
        if (status === "approved" && tier === 1) {
            return {
                label: "Verified",
                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600"
            }
        }
        if (status === "approved" && tier === 2) {
            return {
                label: "Trusted",
                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600"
            }
        }
        return {
            label: "Unverified",
            className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
        }
    }

    const mapProductToListing = (product: any) => {
        const images = Array.isArray(product.product_images) ? product.product_images : []
        const primaryImage = images
            .slice()
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]?.image_url
        const location = [product.location_city, product.neighborhood].filter(Boolean).join(", ")
        const categoryLabel = product.categories?.name || product.category || product.category_name || product.category_id
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            location,
            image: primaryImage,
            category: categoryLabel
        }
    }

    const { data: sellerData, isLoading: isSellerLoading } = useCachedData(
        `seller:${sellerId}`,
        async () => marketplaceService.getUserProfile(sellerId),
        { enabled: !!sellerId }
    )

    const { data: productsData, isLoading: isProductsLoading } = useCachedData(
        `seller:${sellerId}:products`,
        async () => {
            const data = await marketplaceService.getSellerProducts({ seller_id: sellerId, page: 1, limit: 20 })
            return (data.products || []).map((p: any) => mapProductToListing(p))
        },
        { enabled: !!sellerId }
    )

    useEffect(() => {
        setSeller(sellerData || null)
    }, [sellerData])

    useEffect(() => {
        setProducts(productsData || [])
    }, [productsData])

    const formatDate = (dateString?: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }

    if (isSellerLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <CupertinoActivityIndicator size={32} />
            </div>
        )
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
                Seller not found.
            </div>
        )
    }

    const badge = getSellerBadge(seller.kyc_status, seller.kyc_tier)

    return (
        <div className="min-h-screen bg-background pb-24">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Seller Profile</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                        {seller.profile_image_url ? (
                            <img src={seller.profile_image_url} alt={seller.full_name || "Seller"} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(seller.full_name)
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="font-bold text-lg flex items-center gap-2">
                            <span>{seller.full_name || "Seller"}</span>
                            {badge.label && <span className={badge.className}>{badge.label}</span>}
                        </div>
                        {seller.location_city && (
                            <div className="text-sm text-muted-foreground">
                                {[seller.location_city, seller.neighborhood].filter(Boolean).join(", ")}
                            </div>
                        )}
                        {seller.created_at && (
                            <div className="text-xs text-muted-foreground">
                                Joined {formatDate(seller.created_at)}
                            </div>
                        )}
                    </div>
                </div>

                {seller.bio && (
                    <div className="text-sm text-muted-foreground">
                        {seller.bio}
                    </div>
                )}

                {(seller.is_phone_verified || seller.is_email_verified) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {seller.is_phone_verified && (
                            <span className="flex items-center gap-1 text-green-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                Phone verified
                            </span>
                        )}
                        {seller.is_email_verified && (
                            <span className="flex items-center gap-1 text-green-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                Email verified
                            </span>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <h2 className="text-lg font-bold">Listings</h2>
                    {isProductsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <CupertinoActivityIndicator size={28} />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {products.map((item) => (
                                <ListingCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
                                    location={item.location}
                                    image={item.image}
                                    category={item.category}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">No listings yet.</div>
                    )}
                </div>
            </main>
        </div>
    )
}
