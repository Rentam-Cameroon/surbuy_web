"use client"

import ListingCard from "@/components/marketplace/ListingCard"

// Mock data (in a real app this would come from props or API)
const SIMILAR_ITEMS = [
    {
        id: "2",
        title: "iPhone 13 Pro Max",
        price: 650000,
        location: "Douala, Akwa",
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=2000&auto=format&fit=crop",
        category: "Electronics",
        isNew: true
    },
    {
        id: "3",
        title: "MacBook Air M2",
        price: 800000,
        location: "Yaoundé, Bastos",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2000&auto=format&fit=crop",
        category: "Electronics"
    },
    {
        id: "4",
        title: "Sony WH-1000XM5",
        price: 250000,
        location: "Buea, Molyko",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop",
        category: "Audio"
    },
    {
        id: "5",
        title: "Samsung Galaxy S23",
        price: 550000,
        location: "Limbe",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2000&auto=format&fit=crop",
        category: "Electronics"
    }
]

export default function SimilarProducts() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Similar Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SIMILAR_ITEMS.map((item) => (
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
