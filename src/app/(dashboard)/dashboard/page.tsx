"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CategoryBar from "@/components/marketplace/CategoryBar"
import ListingCard from "@/components/marketplace/ListingCard"

// Mock Data
const MOCK_LISTINGS = [
    {
        id: 1,
        title: "iPhone 15 Pro Max - 256GB",
        price: 850000,
        location: "Akwa, Douala",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics",
        isNew: true
    },
    {
        id: 2,
        title: "Modern Sofa Set - 5 Seater",
        price: 350000,
        location: "Bastos, Yaoundé",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
        category: "Furniture"
    },
    {
        id: 3,
        title: "Toyota Vitz 2015",
        price: 3500000,
        location: "Buea, South West",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop",
        category: "Vehicles"
    },
    {
        id: 4,
        title: "PS5 Console + 2 Controllers",
        price: 400000,
        location: "Bonapriso, Douala",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop",
        category: "Gaming",
        isNew: true
    },
    {
        id: 5,
        title: "MacBook Air M2",
        price: 750000,
        location: "Yaoundé",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics"
    },
    {
        id: 6,
        title: "Nike Air Jordan 1",
        price: 45000,
        location: "Limbe",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        category: "Fashion"
    }
]

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background pb-20 md:pb-8">
            {/* Header / Search Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for anything..."
                                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <CategoryBar />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-8">
                {/* Featured / Recent */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-bold tracking-tight">Fresh Recommendations</h2>
                        <a href="#" className="text-sm font-medium text-primary hover:underline">
                            View all
                        </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MOCK_LISTINGS.map((item) => (
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
                </section>
            </main>
        </div>
    )
}
