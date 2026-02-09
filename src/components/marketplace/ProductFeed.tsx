"use client"

import { useEffect, useState } from "react"
import ListingCard from "./ListingCard"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { marketplaceService } from "@/lib/marketplaceService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useI18n } from "@/contexts/I18nContext"

interface ProductFeedProps {
    category: string
    userId?: string | null
}

export default function ProductFeed({ category, userId }: ProductFeedProps) {
    const { t } = useI18n()
    const [products, setProducts] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const { ref, isIntersecting: inView } = useIntersectionObserver()

    const loadProducts = async (reset = false) => {
        if (isLoading) return
        if (!reset && !hasMore) return

        setIsLoading(true)
        try {
            const currentPage = reset ? 1 : page
            const limit = 30
            const response = await marketplaceService.listProducts({
                page: currentPage,
                limit,
                category_id: category === "all" ? undefined : category,
                user_id: userId
            })

            const newProducts = (response.products || []).map((p: any) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                location: [p.location_city, p.neighborhood].filter(Boolean).join(", "),
                image: p.product_images?.[0]?.image_url, // basic mapping, better in page?
                category: p.categories?.name || p.category,
                isNew: false
            }))

            if (reset) {
                setProducts(newProducts)
                setPage(2)
            } else {
                setProducts((prev) => [...prev, ...newProducts])
                setPage((prev) => prev + 1)
            }

            setHasMore(newProducts.length === limit)
        } catch (error) {
            console.error("Failed to load products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Reset when category changes
    useEffect(() => {
        setHasMore(true)
        loadProducts(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category])

    // Infinite scroll
    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadProducts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, hasMore, isLoading])

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {products.map((item, i) => (
                    <div key={`${item.id}-${i}`}>
                        <ListingCard
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            location={item.location}
                            image={item.image}
                            category={item.category}
                            isNew={item.isNew}
                        />
                    </div>
                ))}
            </div>

            {/* Loading Indicator / Sentinel */}
            <div ref={ref} className="flex justify-center py-8">
                {isLoading && <CupertinoActivityIndicator size={32} />}
                {!isLoading && !hasMore && products.length > 0 && (
                    <p className="text-muted-foreground text-sm">{t("No more products")}</p>
                )}
                {!isLoading && !hasMore && products.length === 0 && (
                    <p className="text-muted-foreground text-sm">{t("No products found")}</p>
                )}
            </div>
        </div>
    )
}
