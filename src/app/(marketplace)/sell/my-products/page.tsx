"use client"

import { Button } from "@/components/ui/button"
import { Plus, Package, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useCallback } from "react"
import { productService } from "@/lib/productService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProductCache } from "@/contexts/ProductCacheContext"

export default function MyProductsPage() {
    const router = useRouter()
    const { getProducts, setProducts, invalidateCache } = useProductCache()
    const [products, setProductsState] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [actioningProductId, setActioningProductId] = useState<string | null>(null)

    const fetchProducts = useCallback(async () => {
        // Check cache first
        const cachedProducts = getProducts()
        if (cachedProducts) {
            setProductsState(cachedProducts)
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            const data = await productService.listMyProducts()
            setProductsState(data || [])
            setProducts(data || []) // Update cache
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setIsLoading(false)
        }
    }, [getProducts, setProducts])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

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

    const handleStatusUpdate = async (productId: string, status: 'sold' | 'deleted') => {
        if (!confirm(`Are you sure you want to mark this product as ${status}?`)) return

        try {
            setActioningProductId(productId)
            await productService.updateProductStatus(productId, status)
            // Invalidate cache and refresh
            invalidateCache()
            fetchProducts()
        } catch (error) {
            console.error("Status update failed:", error)
            alert(`Failed to update product status`)
        } finally {
            setActioningProductId(null)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-32">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">My Products</h1>
                        <p className="text-muted-foreground text-sm">Manage your listings</p>
                    </div>
                    <Link href="/sell/create">
                        <Button className="rounded-full gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Product</span>
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
                        {products.map((product) => {
                            const firstImage = product.images?.[0]?.image_url

                            return (
                                <div key={product.id} className="bg-muted/30 rounded-2xl p-4 border border-border/10 overflow-hidden">
                                    <div className="flex gap-4 items-start">
                                        <div className="relative h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                            {firstImage ? (
                                                <Image src={firstImage} alt={product.title} fill className="object-cover" sizes="64px" />
                                            ) : (
                                                <Package className="h-8 w-8 text-muted-foreground/40" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold truncate text-sm md:text-base">{product.title}</h3>
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap",
                                                    product.status === 'approved' ? "bg-green-100 text-green-600" :
                                                        product.status === 'pending' ? "bg-blue-100 text-blue-600" :
                                                            product.status === 'sold' ? "bg-gray-100 text-gray-600" :
                                                                "bg-red-100 text-red-600"
                                                )}>
                                                    {product.status || 'pending'}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground line-clamp-1">{product.category} • {product.condition}</p>
                                            <p className="text-sm font-black text-primary mt-1">{product.price.toLocaleString()} FCFA</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
                                        <Link href={`/sell/create?edit=${product.id}`} className="flex-1">
                                            <Button size="sm" variant="outline" className="rounded-xl w-full">
                                                Edit
                                            </Button>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="outline" className="rounded-xl flex-1" disabled={actioningProductId === product.id}>
                                                    Actions
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(product.id, 'sold')}>
                                                    Mark as Sold
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(product.id, 'deleted')} className="text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )
                        })}
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
        </div>
    )
}
