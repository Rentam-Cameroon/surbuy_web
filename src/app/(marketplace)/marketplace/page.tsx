"use client"

import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryBar from "@/components/marketplace/CategoryBar"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductSection from "@/components/marketplace/ProductSection"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authService } from "@/lib/authService"
import { marketplaceService } from "@/lib/marketplaceService"
import { useMarketplaceCache } from "@/contexts/MarketplaceCacheContext"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserIdFromCookie } from "@/lib/auth-utils"

export default function Dashboard() {
    const router = useRouter()
    const { getCache, setCache } = useMarketplaceCache()
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()
    const [isCheckingKyc, setIsCheckingKyc] = useState(false)
    const [newListings, setNewListings] = useState<any[]>([])
    const [popularListings, setPopularListings] = useState<any[]>([])
    const [recommendedListings, setRecommendedListings] = useState<any[]>([])
    const [isLoadingNew, setIsLoadingNew] = useState(true)
    const [isLoadingPopular, setIsLoadingPopular] = useState(true)
    const [isLoadingRecommended, setIsLoadingRecommended] = useState(true)

    const handleSellClick = async () => {
        if (isCheckingKyc) return
        setIsCheckingKyc(true)
        try {
            const data = await authService.getUserKYCStatus()
            const isApproved = data.kyc_status === "approved" && (data.kyc_tier ?? 0) >= 1
            router.push(isApproved ? "/sell" : "/kyc")
        } catch (err) {
            router.push("/kyc")
        } finally {
            setIsCheckingKyc(false)
        }
    }

    const mapProductToListing = (product: any, isNewSection = false) => {
        const images = Array.isArray(product.product_images) ? product.product_images : []
        const primaryImage = images
            .slice()
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]?.image_url
        const location = [product.location_city, product.neighborhood].filter(Boolean).join(", ")
        const category = product.categories?.name || product.category || product.category_name || product.category_id
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            location,
            image: primaryImage,
            category,
            isNew: isNewSection
        }
    }

    useEffect(() => {
        const loadListings = async () => {
            try {
                const cachedNew = getCache("marketplace:new")
                const cachedPopular = getCache("marketplace:popular")
                const cachedRecommended = getCache("marketplace:recommended")

                if (cachedNew) {
                    setNewListings(cachedNew)
                    setIsLoadingNew(false)
                }
                if (cachedPopular) {
                    setPopularListings(cachedPopular)
                    setIsLoadingPopular(false)
                }
                if (cachedRecommended) {
                    setRecommendedListings(cachedRecommended)
                    setIsLoadingRecommended(false)
                }

                const [newRes, popularRes, recommendedRes] = await Promise.all([
                    cachedNew ? null : marketplaceService.listProducts({ type: "new", page: 1, limit: 4, user_id: userId ?? null }),
                    cachedPopular ? null : marketplaceService.listProducts({ type: "popular", page: 1, limit: 4, user_id: userId ?? null }),
                    cachedRecommended ? null : marketplaceService.listProducts({ type: "recommended", page: 1, limit: 4, user_id: userId ?? null }),
                ])

                if (newRes) {
                    const mapped = (newRes.products || []).map((p: any) => mapProductToListing(p, true))
                    setNewListings(mapped)
                    setCache("marketplace:new", mapped)
                    setIsLoadingNew(false)
                }
                if (popularRes) {
                    const mapped = (popularRes.products || []).map((p: any) => mapProductToListing(p))
                    setPopularListings(mapped)
                    setCache("marketplace:popular", mapped)
                    setIsLoadingPopular(false)
                }
                if (recommendedRes) {
                    const mapped = (recommendedRes.products || []).map((p: any) => mapProductToListing(p))
                    setRecommendedListings(mapped)
                    setCache("marketplace:recommended", mapped)
                    setIsLoadingRecommended(false)
                }
            } catch (err) {
                console.error("Failed to load marketplace listings:", err)
            } finally {
                setIsLoadingNew(false)
                setIsLoadingPopular(false)
                setIsLoadingRecommended(false)
            }
        }

        loadListings()
    }, [getCache, setCache, userId])

    return (
        <div className="min-h-screen bg-background pb-28 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto py-3 space-y-4">
                    <div className="flex items-center px-4 justify-between h-10 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/icon.svg" alt="Surbuy Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold tracking-widest text-primary font-mono italic">
                                SURBUY
                            </span>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleSellClick}
                                size="sm"
                                className="rounded-full h-9 px-5 font-bold shadow-lg shadow-primary/20 gap-1.5 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Sell
                            </Button>
                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <CategoryBar />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-10">
                <ProductSection
                    title="Newly Added"
                    listings={newListings}
                    isLoading={isLoadingNew}
                    href="/view-all?title=Newly%20Added&type=new"
                />
                <ProductSection
                    title="Popular"
                    listings={popularListings}
                    isLoading={isLoadingPopular}
                    href="/view-all?title=Popular&type=popular"
                />
                <ProductSection
                    title="Recommended for you"
                    listings={recommendedListings}
                    isLoading={isLoadingRecommended}
                    href="/view-all?title=Recommended&type=recommended"
                />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
