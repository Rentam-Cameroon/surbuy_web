"use client"

import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import ListingCard from "@/components/marketplace/ListingCard"
import { MOCK_LISTINGS } from "@/lib/mockData"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ViewAllPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const title = searchParams.get('title') || 'Listings'
    const category = searchParams.get('category')
    const type = searchParams.get('type') // 'new', 'popular', etc.

    // Filter logic
    const filteredListings = MOCK_LISTINGS.filter(item => {
        if (category && category !== 'all') {
            return item.category.toLowerCase() === category.toLowerCase()
        }
        if (type === 'new') {
            return item.isNew
        }
        // Add more logic for 'popular' if we had a popular flag, otherwise show all
        return true
    })

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
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <main className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredListings.map((item) => (
                        <ListingCard
                            key={item.id}
                            title={item.title}
                            price={item.price}
                            location={item.location}
                            image={item.image}
                            category={item.category}
                            isNew={item.isNew}
                        />
                    ))}
                </div>
                {filteredListings.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No listings found.
                    </div>
                )}
            </main>
        </div>
    )
}
