"use client"

import { ChevronDown, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useI18n } from "@/contexts/I18nContext"

interface FilterProps {
    selectedCategory: string
    setCategory: (val: string) => void
    sortOrder: string
    setSortOrder: (val: string) => void
    priceRange: string
    setPriceRange: (val: string) => void
    location: string
    setLocation: (val: string) => void
    condition: string
    setCondition: (val: string) => void
}

const CATEGORIES = ["All", "Electronics", "Furniture", "Vehicles", "Real Estate", "Fashion"]
const CONDITIONS = ["Any", "New", "Used - Like New", "Used - Good", "Used - Fair"]
const LOCATIONS = ["Anywhere", "Douala", "Yaoundé", "Garoua", "Bamenda"]
const PRICES = ["Any Price", "Under 50,000", "50,000 - 200,000", "200,000 - 500,000", "Over 500,000"]

export default function SearchFilterBar({
    selectedCategory,
    setCategory,
    sortOrder,
    setSortOrder,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    condition,
    setCondition
}: FilterProps) {
    const { t } = useI18n()
    return (
        <div className="w-full bg-background border-b border-border/40 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar scroll-smooth">
                {/* Sort Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full h-9 gap-2 shrink-0 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all">
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{t("Sort")}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 rounded-xl shadow-xl border-border/40">
                        <DropdownMenuLabel className="text-xs">{t("Sort By")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                            <DropdownMenuRadioItem value="newest" className="text-sm">{t("Newest First")}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="oldest" className="text-sm">{t("Oldest First")}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="price-low" className="text-sm">{t("Lowest Price")}</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="price-high" className="text-sm">{t("Highest Price")}</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-px bg-border/40 shrink-0 mx-1" />

                {/* Category Filter */}
                <FilterDropdown
                    label={t("Category")}
                    value={selectedCategory}
                    options={CATEGORIES}
                    onChange={setCategory}
                />

                {/* Price Filter */}
                <FilterDropdown
                    label={t("Price")}
                    value={priceRange}
                    options={PRICES}
                    onChange={setPriceRange}
                />

                {/* Location Filter */}
                <FilterDropdown
                    label={t("Location")}
                    value={location}
                    options={LOCATIONS}
                    onChange={setLocation}
                />

                {/* Condition Filter */}
                <FilterDropdown
                    label={t("Condition")}
                    value={condition}
                    options={CONDITIONS}
                    onChange={setCondition}
                />
            </div>
        </div>
    )
}

function FilterDropdown({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
    const { t } = useI18n()
    const isActive = value !== options[0] && value !== "Any" && value !== "Anywhere" && value !== "Any Price"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={isActive ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                        "rounded-full h-9 gap-2 shrink-0 border-border/60 transition-all text-xs font-medium",
                        isActive && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    )}
                >
                    {isActive ? t(value) : label}
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform", isActive && "text-primary opacity-100")} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-xl border-border/40">
                <DropdownMenuLabel className="text-xs">{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
                    {options.map((opt) => (
                        <DropdownMenuRadioItem key={opt} value={opt} className="text-sm">
                            {t(opt)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
