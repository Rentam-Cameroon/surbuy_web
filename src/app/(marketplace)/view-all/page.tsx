"use client"

import { Search, ArrowLeft } from "lucide-react"
import ListingCard from "@/components/marketplace/ListingCard"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { marketplaceService } from "@/lib/marketplaceService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useMarketplaceCache } from "@/contexts/MarketplaceCacheContext"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserIdFromCookie } from "@/lib/auth-utils"

export default function ViewAllPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const title = searchParams.get('title') || 'Listings'
    const category = searchParams.get('category')
    const type = searchParams.get('type') // 'new', 'popular', etc.
    const [listings, setListings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { getCache, setCache } = useMarketplaceCache()
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()

    const handleSearchClick = () => {
        router.push('/search')
    }

    const mapProductToListing = (product: any, isNewSection = false) => {
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
            category: categoryLabel,
            isNew: isNewSection
        }
    }

    useEffect(() => {
        const loadListings = async () => {
            try {
                setIsLoading(true)
                const cacheKey = `view-all:${type || "new"}:${category || "all"}`
                const cached = getCache(cacheKey)
                if (cached) {
                    setListings(cached)
                    setIsLoading(false)
                    return
                }

                const data = await marketplaceService.listProducts({
                    type: (type as "new" | "popular" | "recommended") || "new",
                    category_id: category && category !== "all" ? category : undefined,
                    page: 1,
                    limit: 20,
                    user_id: userId ?? null
                })
                const isNewSection = type === "new"
                const mapped = (data.products || []).map((p: any) => mapProductToListing(p, isNewSection))
                setListings(mapped)
                setCache(cacheKey, mapped)
            } catch (err) {
                console.error("Failed to load listings:", err)
                setListings([])
            } finally {
                setIsLoading(false)
            }
        }

        loadListings()
    }, [category, type, getCache, setCache, userId])

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto px-4 py-3 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="-ml-2" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-bold truncate max-w-[200px]">{title}</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSearchClick}>
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <main className="container mx-auto px-4 py-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <CupertinoActivityIndicator size={32} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {listings.map((item) => (
                                <ListingCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
                                    location={item.location}
                                    image={item.image}
                                    category={item.category}
                                    isNew={item.isNew}
                                />
                            ))}
                        </div>
                        {listings.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No listings found.
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
