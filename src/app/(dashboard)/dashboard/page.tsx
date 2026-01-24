"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CategoryBar from "@/components/marketplace/CategoryBar"
import ListingCard from "@/components/marketplace/ListingCard"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductSection from "@/components/marketplace/ProductSection"

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
        <div className="min-h-screen bg-background pb-28 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container mx-auto px-4 py-3 space-y-4">
                    <div className="flex items-center justify-center md:justify-start h-10 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            {/* Placeholder for Logo Icon */}
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                S
                            </div>
                            <span className="text-xl font-bold tracking-widest text-primary hidden md:block">
                                SURBUY
                            </span>
                            <span className="text-xl font-bold tracking-widest text-primary md:hidden">
                                SURBUY
                            </span>
                        </div>
                    </div>

                    {/* Categories */}
                    <CategoryBar />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-10">
                <ProductSection title="Newly Added" listings={MOCK_LISTINGS.slice(0, 4)} />
                <ProductSection title="Popular" listings={MOCK_LISTINGS.slice(2, 6)} />
                <ProductSection title="Recommended for you" listings={MOCK_LISTINGS.slice(1, 5)} />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
