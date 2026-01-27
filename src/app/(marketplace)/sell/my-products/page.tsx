"use client"

import { Button } from "@/components/ui/button"
import { Plus, Package, Search, Filter } from "lucide-react"
import Link from "next/link"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { productService } from "@/lib/productService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { cn } from "@/lib/utils"

export default function MyProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const data = await productService.listMyProducts()
            setProducts(data || [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (!query.trim()) {
            fetchProducts()
            return
        }

        try {
            setIsSearching(true)
            const data = await productService.searchMyProducts(query)
            setProducts(data || [])
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">My Products</h1>
                    <Link href="/sell/create">
                        <Button size="sm" className="rounded-full gap-2">
                            <Plus className="h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-6">
                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        {isSearching ? (
                            <CupertinoActivityIndicator size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                            placeholder="Search your listings..."
                            className="rounded-xl pl-10 bg-muted/30 border-none h-11"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <CupertinoActivityIndicator size={32} />
                        <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-muted/30 rounded-2xl p-4 flex gap-4 items-center border border-border/10">
                                <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    <Package className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold truncate">{product.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{product.category} • {product.condition}</p>
                                    <p className="text-sm font-black text-primary mt-1">{product.price.toLocaleString()} FCFA</p>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    product.status === 'approved' ? "bg-green-100 text-green-600" :
                                        product.status === 'pending' ? "bg-blue-100 text-blue-600" :
                                            "bg-red-100 text-red-600"
                                )}>
                                    {product.status || 'pending'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <Package className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{searchQuery ? "No results found" : "No active listings"}</h2>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "Try a different search term." : "List your first product to start earning."}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Link href="/sell/create">
                                <Button variant="outline" className="rounded-xl">Create Listing</Button>
                            </Link>
                        )}
                    </div>
                )}
            </main>

            <FloatingNavbar />
        </div>
    )
}
