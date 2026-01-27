"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ProductGallery from "@/components/marketplace/product-detail/ProductGallery"
import ProductInfo from "@/components/marketplace/product-detail/ProductInfo"
import SimilarProducts from "@/components/marketplace/product-detail/SimilarProducts"
import { Button } from "@/components/ui/button"

// Mock Data for the product
const MOCK_PRODUCT = {
    id: "1",
    title: "Gaming Laptop Asus ROG Strix",
    price: 850000,
    description: `Selling my used Asus ROG Strix gaming laptop. It's in excellent condition, barely used for 6 months.

Specs:
- Intel Core i7 12th Gen
- RTX 3060 6GB
- 16GB RAM
- 1TB SSD
- 144Hz Screen

Reason for selling: Upgrading to a desktop. 
Comes with original charger and box. Price is slightly negotiable for serious buyers only.`,
    location: "Douala, Bonapriso",
    postedDate: "2 days ago",
    category: "Computers & Laptops",
    condition: "Like New",
    images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=2000&auto=format&fit=crop"
    ],
    seller: {
        name: "Jean-Pierre",
        avatar: "JP", // Initials
        joinedDate: "Mar 2023",
        rating: 4.8
    }
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()

    // In a real app, use params.id to fetch data
    const product = MOCK_PRODUCT

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
                    <ProductGallery images={product.images} title={product.title} />
                </div>

                {/* Right Column: Info & Actions */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-6">
                        <ProductInfo
                            title={product.title}
                            price={product.price}
                            description={product.description}
                            location={product.location}
                            postedDate={product.postedDate}
                            category={product.category}
                            condition={product.condition}
                            seller={product.seller}
                        />
                    </div>
                </div>
            </div>

            {/* Similar Items Section */}
            <div className="mt-16 pt-8 border-t border-border/50">
                <SimilarProducts />
            </div>
        </div>
    )
}
