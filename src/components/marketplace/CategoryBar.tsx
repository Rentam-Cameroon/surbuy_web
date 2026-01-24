"use client"

import { Button } from "@/components/ui/button"

import { Car, Home, Smartphone, Shirt, Gamepad, Watch, Bike, Sofa } from "lucide-react"

const categories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'electronics', name: 'Electronics', icon: Smartphone },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'vehicles', name: 'Vehicles', icon: Car },
    { id: 'real-estate', name: 'Real Estate', icon: Home },
    { id: 'gaming', name: 'Gaming', icon: Gamepad },
    { id: 'accessories', name: 'Accessories', icon: Watch },
    { id: 'sports', name: 'Sports', icon: Bike },
    { id: 'furniture', name: 'Furniture', icon: Sofa },
]

export default function CategoryBar() {
    return (
        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex w-max space-x-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={cat.id === 'all' ? "default" : "outline"}
                        className="rounded-full px-6 gap-2"
                        size="sm"
                    >
                        {cat.icon && <cat.icon className="h-4 w-4" />}
                        {cat.name}
                    </Button>
                ))}
            </div>
        </div>
    )
}
