import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

import { Button } from "@/components/ui/button" // Assuming you have this
import { Heart, MapPin } from "lucide-react"
import Image from "next/image"

interface ListingCardProps {
    title: string
    price: number
    location: string
    image: string
    category: string
    isNew?: boolean
}

export default function ListingCard({ id = "1", title, price, location, image, category, isNew }: ListingCardProps & { id?: string }) {
    return (
        <Link href={`/marketplace/product/${id}`}>
            <Card className="overflow-hidden border-border/40 hover:shadow-lg transition-all group cursor-pointer bg-card h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500"
                            onClick={(e) => {
                                e.preventDefault() // Prevent navigation when clicking heart
                                e.stopPropagation()
                            }}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                    {isNew && (
                        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            NEW
                        </span>
                    )}
                </div>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                            {category}
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="font-bold text-xl mt-1 text-primary">
                        {price.toLocaleString('fr-CM')} XAF
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{location}</span>
                </CardFooter>
            </Card>
        </Link>
    )
}
