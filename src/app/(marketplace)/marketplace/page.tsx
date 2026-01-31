"use client"

import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryBar from "@/components/marketplace/CategoryBar"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductSection from "@/components/marketplace/ProductSection"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authService } from "@/lib/authService"
import { marketplaceService } from "@/lib/marketplaceService"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserIdFromCookie } from "@/lib/auth-utils"
import { useCachedData } from "@/hooks/useCachedData"
import Image from "next/image"
import { useI18n } from "@/contexts/I18nContext"

export default function Dashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()
    const [isCheckingKyc, setIsCheckingKyc] = useState(false)
    const { t } = useI18n()

    const handleSellClick = async () => {
        if (isCheckingKyc) return
        setIsCheckingKyc(true)
        try {
            const data = await authService.getUserKYCStatus()
            const isApproved = data.kyc_status === "approved" && (data.kyc_tier ?? 0) >= 1
            router.push(isApproved ? "/sell" : "/kyc")
        } catch {
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

    const { data: newListingsData, isLoading: isLoadingNew } = useCachedData(
        `marketplace:new:${userId || "anon"}`,
        async () => {
            const res = await marketplaceService.listProducts({ type: "new", page: 1, limit: 4, user_id: userId ?? null })
            return (res.products || []).map((p: any) => mapProductToListing(p, true))
        }
    )

    const { data: popularListingsData, isLoading: isLoadingPopular } = useCachedData(
        `marketplace:popular:${userId || "anon"}`,
        async () => {
            const res = await marketplaceService.listProducts({ type: "popular", page: 1, limit: 4, user_id: userId ?? null })
            return (res.products || []).map((p: any) => mapProductToListing(p))
        }
    )

    const { data: recommendedListingsData, isLoading: isLoadingRecommended } = useCachedData(
        `marketplace:recommended:${userId || "anon"}`,
        async () => {
            const res = await marketplaceService.listProducts({ type: "recommended", page: 1, limit: 4, user_id: userId ?? null })
            return (res.products || []).map((p: any) => mapProductToListing(p))
        }
    )

    return (
        <div className="min-h-screen bg-background pb-28 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto py-3 space-y-4">
                    <div className="flex items-center px-4 justify-between h-10 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Image src="/surbuy-logo.png" alt="Surbuy Logo" width={128} height={32} className="logo-light" style={{ height: "auto" }} priority />
                            <Image src="/surbuy-logo-dark.png" alt="Surbuy Logo" width={128} height={32} className="logo-dark" style={{ height: "auto" }} priority />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleSellClick}
                                size="sm"
                                className="rounded-full h-9 px-5 font-bold shadow-lg shadow-primary/20 gap-1.5 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                {t("Sell")}
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
                    title={t("Newly Added")}
                    listings={newListingsData || []}
                    isLoading={isLoadingNew}
                    href="/view-all?title=Newly%20Added&type=new"
                />
                <ProductSection
                    title={t("Popular")}
                    listings={popularListingsData || []}
                    isLoading={isLoadingPopular}
                    href="/view-all?title=Popular&type=popular"
                />
                <ProductSection
                    title={t("Recommended for you")}
                    listings={recommendedListingsData || []}
                    isLoading={isLoadingRecommended}
                    href="/view-all?title=Recommended&type=recommended"
                />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
