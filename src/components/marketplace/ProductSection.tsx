"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ListingCard from "./ListingCard"

interface ProductSectionProps {
    title: string
    listings: any[]
}

export default function ProductSection({ title, listings }: ProductSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-1 h-auto py-1 px-2 text-sm font-semibold">
                    View all <ArrowRight className="h-3 w-3" />
                </Button>
            </div>

            {/* 
                Mobile: Horizontal Scroll 
                Desktop: Grid 
            */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                {listings.map((item) => (
                    <div key={item.id} className="min-w-[260px] md:min-w-0">
                        <ListingCard
                            title={item.title}
                            price={item.price}
                            location={item.location}
                            image={item.image}
                            category={item.category}
                            isNew={item.isNew}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
