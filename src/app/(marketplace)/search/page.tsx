"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, Clock, TrendingUp, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MOCK_LISTINGS } from "@/lib/mockData"
import ListingCard from "@/components/marketplace/ListingCard"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import SearchFilterBar from "@/components/search/SearchFilterBar"
import { cn } from "@/lib/utils"

const POPULAR_SEARCHES = ["iPhone 15", "Toyota", "Apartment", "MacBook M3", "Sofa"]

export default function SearchPage() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Filter & Sort States
    const [selectedCategory, setCategory] = useState("All")
    const [priceRange, setPriceRange] = useState("Any Price")
    const [location, setLocation] = useState("Anywhere")
    const [condition, setCondition] = useState("Any")
    const [sortOrder, setSortOrder] = useState("newest")

    useEffect(() => {
        // Load recent searches from local storage
        const stored = localStorage.getItem("recentSearches")
        if (stored) {
            setRecentSearches(JSON.parse(stored))
        }
        // Focus input on mount
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        if (query.trim().length > 0) {
            // Generate suggestions based on mock listings
            const filtered = MOCK_LISTINGS
                .filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.toLowerCase().includes(query.toLowerCase())
                )
                .map(item => item.title)
                .slice(0, 8)

            // Deduplicate and filter out the exact query
            setSuggestions(Array.from(new Set(filtered)))
        } else {
            setSuggestions([])
        }
    }, [query])

    // Effect to handle filtering and sorting when criteria change
    useEffect(() => {
        if (isSearching) {
            applyFiltersAndSort(query)
        }
    }, [selectedCategory, priceRange, location, condition, sortOrder, isSearching])

    const applyFiltersAndSort = (searchTerm: string) => {
        let filtered = MOCK_LISTINGS.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )

        // Apply Category Filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(item => item.category === selectedCategory)
        }

        // Apply Location Filter
        if (location !== "Anywhere") {
            filtered = filtered.filter(item => item.location.includes(location))
        }

        // Apply Price Filter (Mock Logic)
        if (priceRange !== "Any Price") {
            if (priceRange === "Under 50,000") filtered = filtered.filter(item => item.price < 50000)
            else if (priceRange === "50,000 - 200,000") filtered = filtered.filter(item => item.price >= 50000 && item.price <= 200000)
            else if (priceRange === "200,000 - 500,000") filtered = filtered.filter(item => item.price >= 200000 && item.price <= 500000)
            else if (priceRange === "Over 500,000") filtered = filtered.filter(item => item.price > 500000)
        }

        // Apply Sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortOrder === "price-low") return a.price - b.price
            if (sortOrder === "price-high") return b.price - a.price
            // Mocking newest/oldest with IDs for now
            if (sortOrder === "newest") return b.id - a.id
            if (sortOrder === "oldest") return a.id - b.id
            return 0
        })

        setResults(sorted)
    }

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return

        // Add to recent searches
        const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 10)
        setRecentSearches(updatedRecent)
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent))

        setQuery(searchTerm)
        setIsSearching(true)
        applyFiltersAndSort(searchTerm)
    }

    const clearRecent = () => {
        setRecentSearches([])
        localStorage.removeItem("recentSearches")
    }

    const removeRecentItem = (e: React.MouseEvent, item: string) => {
        e.stopPropagation()
        const updated = recentSearches.filter(s => s !== item)
        setRecentSearches(updated)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
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
                        placeholder="Search for anything..."
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
                        {query.length > 0 && suggestions.length > 0 && (
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
                        {(query.length === 0 || suggestions.length === 0) && recentSearches.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between px-6 py-2">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecent}
                                        className="text-[11px] h-6 px-2 font-bold text-primary hover:bg-primary/5 rounded-lg"
                                    >
                                        CLEAR
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
                        {(query.length === 0 || suggestions.length === 0) && (
                            <div className="px-6">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Popular Searches</h2>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_SEARCHES.map((item, idx) => (
                                        <Button
                                            key={idx}
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSearch(item)}
                                            className="rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary border-none transition-all flex items-center gap-2 h-9 px-4 text-sm font-medium"
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
                                {results.length === 0 ? "No results found" : `${results.length} results for "${query}"`}
                            </h2>
                        </div>
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
                                    isNew={item.isNew}
                                />
                            ))}
                        </div>
                        {results.length === 0 && (
                            <div className="py-20 text-center px-6">
                                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-bold">No results found</h3>
                                <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms</p>
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
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <FloatingNavbar />
        </div>
    )
}

