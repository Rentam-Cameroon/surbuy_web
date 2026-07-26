"use client"

import { Button } from "@/components/ui/button"
import { Car, Home, Smartphone, Shirt, Gamepad, Watch, Bike, Sofa } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { productService } from "@/lib/productService"
import { useCachedData } from "@/hooks/useCachedData"

const iconMap: Record<string, any> = {
    electronics: Smartphone,
    fashion: Shirt,
    vehicles: Car,
    "real-estate": Home,
    gaming: Gamepad,
    accessories: Watch,
    sports: Bike,
    furniture: Sofa,
}

interface CategoryBarProps {
    onSelect?: (categoryId: string) => void
    selectedCategory?: string
}

export default function CategoryBar({ onSelect, selectedCategory = "all" }: CategoryBarProps) {
    const router = useRouter()
    const { data: categoriesData } = useCachedData(
        "marketplace:categories",
        async () => productService.listCategories(),
        { ttlMs: 30 * 60 * 1000 }
    )

    const categories = useMemo(() => {
        const mapped = (categoriesData || []).map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            icon: iconMap[cat.id] || null
        }))
        return [{ id: "all", name: "All", icon: null }, ...mapped]
    }, [categoriesData])

    const handleCategoryClick = (cat: typeof categories[0]) => {
        if (onSelect) {
            onSelect(cat.id)
        } else {
            if (cat.id === 'all') {
                router.push('/marketplace')
            } else {
                router.push(`/view-all?title=${encodeURIComponent(cat.name)}&category=${cat.id}`)
            }
        }
    }

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex w-max px-4 space-x-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        className="rounded-full px-6 gap-2"
                        size="sm"
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat.icon && <cat.icon className="h-4 w-4" />}
                        {cat.name}
                    </Button>
                ))}
            </div>
        </div>
    )
}
