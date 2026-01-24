import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CategoryBar from "@/components/marketplace/CategoryBar"
import ListingCard from "@/components/marketplace/ListingCard"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import ProductSection from "@/components/marketplace/ProductSection"
import { MOCK_LISTINGS } from "@/lib/mockData"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background pb-28 md:pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto py-3 space-y-4">
                    <div className="flex items-center px-4 justify-start h-10 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/icon.svg" alt="Surbuy Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold tracking-widest text-primary">
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
                <ProductSection
                    title="Newly Added"
                    listings={MOCK_LISTINGS.slice(0, 4)}
                    href="/view-all?title=Newly%20Added&type=new"
                />
                <ProductSection
                    title="Popular"
                    listings={MOCK_LISTINGS.slice(2, 6)}
                    href="/view-all?title=Popular"
                />
                <ProductSection
                    title="Recommended for you"
                    listings={MOCK_LISTINGS.slice(1, 5)}
                    href="/view-all?title=Recommended"
                />
            </main>

            {/* Floating Navbar */}
            <FloatingNavbar />
        </div>
    )
}
