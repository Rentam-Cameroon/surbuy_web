"use client"

import ListingCard from "@/components/marketplace/ListingCard"

export default function SimilarProducts({ items }: { items: any[] }) {
    if (!items || items.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Similar Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <ListingCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        location={item.location}
                        image={item.image}
                        category={item.category}
                        isNew={item.isNew}
                    />
                ))}
            </div>
        </div>
    )
}
