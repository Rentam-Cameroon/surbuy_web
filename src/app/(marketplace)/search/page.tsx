"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, Clock, TrendingUp, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ListingCard from "@/components/marketplace/ListingCard"
import SearchFilterBar from "@/components/search/SearchFilterBar"
import { marketplaceService } from "@/lib/marketplaceService"
import { useAuthStore } from "@/store/useAuthStore"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { getUserIdFromCookie } from "@/lib/auth-utils"
import { useI18n } from "@/contexts/I18nContext"

export default function SearchPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const userId = user?.id || getUserIdFromCookie()
    const { t } = useI18n()
    const [query, setQuery] = useState("")
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [popularSearches, setPopularSearches] = useState<string[]>([])
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isSearchingResults, setIsSearchingResults] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Filter & Sort States
    const [selectedCategory, setCategory] = useState("All")
    const [priceRange, setPriceRange] = useState("Any Price")
    const [location, setLocation] = useState("Anywhere")
    const [condition, setCondition] = useState("Any")
    const [sortOrder, setSortOrder] = useState("newest")

    useEffect(() => {
        const loadRecentAndPopular = async () => {
            try {
                if (userId) {
                    const recent = await marketplaceService.getRecentSearches(userId)
                    setRecentSearches(recent.map((r: any) => r.keyword || r))
                } else {
                    const stored = localStorage.getItem("recentSearches")
                    if (stored) {
                        setRecentSearches(JSON.parse(stored))
                    }
                }

                const popular = await marketplaceService.getPopularSearches()
                setPopularSearches(popular.map((p: any) => p.keyword || p))
            } catch (err) {
                console.error("Failed to load searches:", err)
            }
        }

        loadRecentAndPopular()
        // Focus input on mount
        inputRef.current?.focus()
    }, [userId])

    useEffect(() => {
        const keyword = query.trim()
        if (suggestionTimerRef.current) {
            clearTimeout(suggestionTimerRef.current)
        }

        if (keyword.length < 2) {
            setSuggestions([])
            return
        }

        suggestionTimerRef.current = setTimeout(async () => {
            try {
                const data = (await marketplaceService.getSearchSuggestions(keyword)) as string[]
                const unique = Array.from(new Set(data))
                    .filter((s) => typeof s === "string")
                    .filter((s) => s.toLowerCase() !== keyword.toLowerCase())
                setSuggestions(unique)
            } catch (err) {
                console.error("Failed to load suggestions:", err)
                setSuggestions([])
            }
        }, 350)

        return () => {
            if (suggestionTimerRef.current) {
                clearTimeout(suggestionTimerRef.current)
            }
        }
    }, [query])

    const runSearch = useCallback(async (searchTerm: string) => {
        const keyword = searchTerm.trim()
        if (keyword.length < 2) return

        const priceToRange = (value: string) => {
            if (value === "Under 50,000") return { min: undefined, max: 50000 }
            if (value === "50,000 - 200,000") return { min: 50000, max: 200000 }
            if (value === "200,000 - 500,000") return { min: 200000, max: 500000 }
            if (value === "Over 500,000") return { min: 500000, max: undefined }
            return { min: undefined, max: undefined }
        }

        const { min, max } = priceToRange(priceRange)
        const sortMap: Record<string, "newest" | "oldest" | "lowest_price" | "highest_price"> = {
            newest: "newest",
            oldest: "oldest",
            "price-low": "lowest_price",
            "price-high": "highest_price",
        }

        try {
            setIsSearchingResults(true)
            const data = await marketplaceService.searchProducts({
                keyword,
                category: selectedCategory !== "All" ? selectedCategory : undefined,
                condition: condition !== "Any" ? condition : undefined,
                location_city: location !== "Anywhere" ? location : undefined,
                min_price: min,
                max_price: max,
                sort_by: sortMap[sortOrder],
                user_id: userId ?? null,
            })
            const mapped = (data || []).map((product: any) => {
                const images = Array.isArray(product.product_images) ? product.product_images : []
                const primaryImage = images
                    .slice()
                    .sort(
                        (a: { display_order?: number }, b: { display_order?: number }) =>
                            (a.display_order ?? 0) - (b.display_order ?? 0)
                    )[0]?.image_url
                const locationLabel = [product.location_city, product.neighborhood].filter(Boolean).join(", ")
                const categoryLabel = product.categories?.name || product.category || product.category_name || product.category_id
                return {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    location: locationLabel,
                    image: primaryImage,
                    category: categoryLabel
                }
            })
            setResults(mapped)
        } catch (err) {
            console.error("Search failed:", err)
            setResults([])
        } finally {
            setIsSearchingResults(false)
        }
    }, [condition, location, priceRange, selectedCategory, sortOrder, userId])

    // Effect to handle filtering and sorting when criteria change
    useEffect(() => {
        if (isSearching) {
            runSearch(query)
        }
    }, [selectedCategory, priceRange, location, condition, sortOrder, isSearching, query, runSearch])

    const handleSearch = (searchTerm: string) => {
        const keyword = searchTerm.trim()
        if (keyword.length < 2) return

        if (!userId) {
            const updatedRecent = [keyword, ...recentSearches.filter(s => s !== keyword)].slice(0, 10)
            setRecentSearches(updatedRecent)
            localStorage.setItem("recentSearches", JSON.stringify(updatedRecent))
        }

        setQuery(keyword)
        setIsSearching(true)
    }

    const clearRecent = () => {
        setRecentSearches([])
        if (!userId) {
            localStorage.removeItem("recentSearches")
        }
    }

    const removeRecentItem = (e: React.MouseEvent, item: string) => {
        e.stopPropagation()
        const updated = recentSearches.filter(s => s !== item)
        setRecentSearches(updated)
        if (!userId) {
            localStorage.setItem("recentSearches", JSON.stringify(updated))
        }
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 flex items-center gap-3 px-4 h-16 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (isSearching) {
                            setIsSearching(false)
                        } else {
                            router.back()
                        }
                    }}
                    className="rounded-full shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="relative flex-1 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            if (isSearching) setIsSearching(false)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                        placeholder={t("Search for anything...")}
                        className="w-full bg-muted/50 border-none rounded-full pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-primary h-10 transition-all font-medium"
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setQuery("")
                                setIsSearching(false)
                                inputRef.current?.focus()
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-transparent"
                        >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                    )}
                </div>
            </header>

            {/* Filter Bar (Only shown when searching) */}
            {isSearching && (
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl">
                    <SearchFilterBar
                        selectedCategory={selectedCategory}
                        setCategory={setCategory}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        location={location}
                        setLocation={setLocation}
                        condition={condition}
                        setCondition={setCondition}
                    />
                </div>
            )}

            <main className="max-w-screen-md mx-auto">
                {!isSearching ? (
                    <div className="py-2">
                        {/* Suggestions while typing */}
                        {query.length >= 2 && suggestions.length > 0 && (
                            <div className="mb-4">
                                {suggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSearch(item)}
                                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/60 transition-colors text-left group"
                                    >
                                        <Search className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                        <span className="flex-1 text-[15px] font-medium">{item}</span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                ))}
                                <div className="h-px bg-border/50 mx-6 my-2" />
                            </div>
                        )}

                        {/* Recent Searches */}
                        {(query.length < 2 || suggestions.length === 0) && recentSearches.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between px-6 py-2">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Recent")}</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecent}
                                        className="text-[11px] h-6 px-2 font-bold text-primary hover:bg-primary/5 rounded-lg"
                                    >
                                        {t("Clear")}
                                    </Button>
                                </div>
                                <div className="space-y-0.5">
                                    {recentSearches.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearch(item)}
                                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/60 transition-colors text-left group"
                                        >
                                            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                            <span className="flex-1 text-[15px] font-medium">{item}</span>
                                            <div
                                                onClick={(e) => removeRecentItem(e, item)}
                                                className="p-1 rounded-full hover:bg-muted-foreground/10"
                                            >
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Popular Searches */}
                        {(query.length < 2 || suggestions.length === 0) && (
                            <div className="px-6">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("Popular Searches")}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((item, idx) => (
                                        <Button
                                            key={idx}
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSearch(item)}
                                            className="rounded-full bg-muted text-foreground hover:bg-primary/10 hover:text-primary border-none transition-all flex items-center gap-2 h-9 px-4 text-sm font-medium"
                                        >
                                            <TrendingUp className="h-3 w-3" />
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Search Results */
                    <div className="pt-2 pb-20 space-y-4">
                        <div className="px-6 flex items-center justify-between mb-0">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {results.length === 0 ? t("No results found") : `${results.length} ${t("results for")} "${query}"`}
                            </h2>
                        </div>
                        {isSearchingResults ? (
                            <div className="flex items-center justify-center py-12">
                                <CupertinoActivityIndicator size={32} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 px-4 overflow-hidden">
                                {results.map((item) => (
                                    <ListingCard
                                        key={item.id}
                                        id={item.id.toString()}
                                        title={item.title}
                                        price={item.price}
                                        location={item.location}
                                        image={item.image}
                                        category={item.category}
                                    />
                                ))}
                            </div>
                        )}
                        {!isSearchingResults && results.length === 0 && (
                            <div className="py-20 text-center px-6">
                                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-bold">{t("No results found")}</h3>
                                <p className="text-muted-foreground text-sm">{t("Try adjusting your filters or search terms")}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCategory("All")
                                        setPriceRange("Any Price")
                                        setLocation("Anywhere")
                                        setCondition("Any")
                                    }}
                                    className="mt-6 rounded-xl"
                                >
                                    {t("Reset All Filters")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
