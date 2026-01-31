"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ProductGallery from "@/components/marketplace/product-detail/ProductGallery"
import ProductInfo from "@/components/marketplace/product-detail/ProductInfo"
import SimilarProducts from "@/components/marketplace/product-detail/SimilarProducts"
import { Button } from "@/components/ui/button"
import { marketplaceService } from "@/lib/marketplaceService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { chatService } from "@/lib/chatService"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserIdFromCookie } from "@/lib/auth-utils"
import { useCachedData } from "@/hooks/useCachedData"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const productId = params?.id as string
    const [product, setProduct] = useState<any | null>(null)
    const [similarItems, setSimilarItems] = useState<any[]>([])
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [isCheckingConversation, setIsCheckingConversation] = useState(true)
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()

    const formatDate = (dateString?: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const mapProductToListing = (data: any) => {
        const images = Array.isArray(data.product_images) ? data.product_images : []
        const primaryImage = images
            .slice()
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]?.image_url
        const location = [data.location_city, data.neighborhood].filter(Boolean).join(", ")
        const category = data.categories?.name || data.category || data.category_name || data.category_id
        return {
            id: data.id,
            title: data.title,
            price: data.price,
            location,
            image: primaryImage,
            category,
        }
    }

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

    const { data: productData, isLoading: isProductLoading } = useCachedData(
        `product:${productId}`,
        async () => {
            const data = await marketplaceService.getProduct(productId)
            return data
        },
        { enabled: !!productId }
    )

    const { data: similarData } = useCachedData(
        `product:${productId}:similar:${userId || "anon"}`,
        async () => {
            const similar = await marketplaceService.getSimilarProducts(productId, userId ?? null)
            return (similar || []).map((p: any) => mapProductToListing(p))
        },
        { enabled: !!productId }
    )

    useEffect(() => {
        setProduct(productData || null)
    }, [productData])

    useEffect(() => {
        setSimilarItems(similarData || [])
    }, [similarData])

    useEffect(() => {
        const checkConversation = async () => {
            try {
                setIsCheckingConversation(true)
                const data = await chatService.checkProductConversation(productId)
                if (data?.exists && data.conversation?.id) {
                    setConversationId(data.conversation.id)
                } else {
                    setConversationId(null)
                }
            } catch (err) {
                console.error("Failed to check conversation:", err)
            } finally {
                setIsCheckingConversation(false)
            }
        }

        if (productId) {
            checkConversation()
        }
    }, [productId])

    const handleOpenSeller = () => {
        if (!product?.seller?.id) return
        router.push(`/seller/${product.seller.id}`)
    }

    const isPlaceholderImages = !product?.product_images?.length
    const images = useMemo(() => {
        if (isPlaceholderImages) return ["/surbuy-icon.png"]
        return product.product_images
            .slice()
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map((img: any) => img.image_url)
            .filter(Boolean)
    }, [product, isPlaceholderImages])

    if (!product && isProductLoading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Button>
                <div className="flex items-center justify-center py-16">
                    <CupertinoActivityIndicator size={32} />
                </div>
            </div>
        )
    }

    if (!product && !isProductLoading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Button>
                <div className="py-20 text-center text-muted-foreground">Product not found.</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in duration-500">
            {/* Back Navigation */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Gallery */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <ProductGallery images={images} title={product?.title || "Product"} isPlaceholder={isPlaceholderImages} />
                </div>

                {/* Right Column: Info & Actions */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-6">
                        {product && (
                            <>
                                <ProductInfo
                                    title={product.title}
                                    price={product.price}
                                    description={product.description || ""}
                                    location={[product.location_city, product.neighborhood].filter(Boolean).join(", ")}
                                    postedDate={formatDate(product.created_at)}
                                    category={product.categories?.name || product.category || product.category_name || product.category_id}
                                    condition={product.condition}
                                    productId={product.id}
                                    conversationId={conversationId}
                                    isConversationLoading={isCheckingConversation}
                                    seller={{
                                        name: product.seller?.full_name || "Seller",
                                        avatar: getInitials(product.seller?.full_name),
                                        avatarUrl: product.seller?.profile_image_url,
                                        joinedDate: "Recently",
                                        rating: 0,
                                        badgeLabel: getSellerBadge(product.seller?.kyc_status, product.seller?.kyc_tier).label,
                                        badgeClassName: getSellerBadge(product.seller?.kyc_status, product.seller?.kyc_tier).className
                                    }}
                                    onSellerClick={handleOpenSeller}
                                />
                                {isCheckingConversation && (
                                    <div className="mt-4 flex items-center justify-center">
                                        <CupertinoActivityIndicator size={22} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Similar Items Section */}
            <div className="mt-16 pt-8 border-t border-border/50">
                <SimilarProducts items={similarItems} />
            </div>

        </div>
    )
}
