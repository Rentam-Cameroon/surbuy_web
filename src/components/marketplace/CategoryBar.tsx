"use client"

import { Button } from "@/components/ui/button"
import { Car, Home, Smartphone, Shirt, Gamepad, Watch, Bike, Sofa } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { productService } from "@/lib/productService"

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

export default function CategoryBar() {
    const router = useRouter()
    const [categories, setCategories] = useState<Array<{ id: string, name: string, icon: any }>>([
        { id: "all", name: "All", icon: null },
    ])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await productService.listCategories()
                const mapped = (data || []).map((cat: any) => ({
                    id: cat.id,
                    name: cat.name,
                    icon: iconMap[cat.id] || null
                }))
                setCategories([{ id: "all", name: "All", icon: null }, ...mapped])
            } catch (err) {
                console.error("Failed to load categories:", err)
            }
        }
        loadCategories()
    }, [])

    const handleCategoryClick = (cat: typeof categories[0]) => {
        if (cat.id === 'all') {
            router.push('/marketplace')
        } else {
            router.push(`/view-all?title=${encodeURIComponent(cat.name)}&category=${cat.id}`)
        }
    }

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex w-max px-4 space-x-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={cat.id === 'all' ? "default" : "outline"}
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
