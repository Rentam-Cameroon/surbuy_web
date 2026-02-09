import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

import { Button } from "@/components/ui/button" // Assuming you have this
import { Heart, MapPin } from "lucide-react"
import Image from "next/image"
interface ListingCardProps {
    title: string
    price: number | string
    location?: string
    image?: string
    category?: string
    isNew?: boolean
}

export default function ListingCard({ id = "1", title, price, location, image, category, isNew }: ListingCardProps & { id?: string }) {
    const resolvedImage = image || ""
    const resolvedCategory = category || ""
    const resolvedLocation = location || ""
    const resolvedPrice = typeof price === "string" ? Number(price) : price

    return (
        <Link href={`/marketplace/product/${id}`}>
            <Card className="overflow-hidden border-border/40 hover:shadow-lg transition-all group cursor-pointer bg-card h-full">
                <div className="relative aspect-[3/4] md:aspect-[4/3] w-full overflow-hidden bg-muted">
                    {resolvedImage ? (
                        <Image
                            src={resolvedImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <>
                            <Image
                                src="/surbuy-icon.png"
                                alt="Surbuy"
                                fill
                                className="object-contain logo-light p-6"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <Image
                                src="/surbuy-icon-dark.png"
                                alt="Surbuy"
                                fill
                                className="object-contain logo-dark p-6"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </>
                    )}
                    <div className="absolute top-3 right-3">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-foreground hover:bg-white hover:text-red-500 shadow-sm"
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
                <CardContent className="p-3 md:p-4">
                    {resolvedCategory && (
                        <div className="flex justify-between items-start mb-1 md:mb-2">
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-[9px] md:text-[10px]">
                                {resolvedCategory}
                            </div>
                        </div>
                    )}
                    <h3 className="font-semibold text-sm md:text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] md:min-h-0">
                        {title}
                    </h3>
                    <div className="font-bold text-base md:text-xl mt-1 text-primary truncate">
                        {Number.isFinite(resolvedPrice) ? resolvedPrice.toLocaleString('fr-CM') : 0} XAF
                    </div>
                </CardContent>
                {resolvedLocation && (
                    <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{resolvedLocation}</span>
                    </CardFooter>
                )}
            </Card>
        </Link>
    )
}
