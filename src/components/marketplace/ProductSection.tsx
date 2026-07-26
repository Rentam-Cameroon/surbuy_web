"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ListingCard from "./ListingCard"
import Link from "next/link"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

interface ProductSectionProps {
    title: string
    listings: any[]
    href?: string
    isLoading?: boolean
}

import { useI18n } from "@/contexts/I18nContext"

export default function ProductSection({ title, listings, href, isLoading = false }: ProductSectionProps) {
    const { t } = useI18n()
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                {href && (
                    <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-1 h-auto py-1 px-2 text-sm font-semibold" asChild>
                        <Link href={href}>
                            {t("View all")} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                )}
            </div>

            {/* 
                Mobile: Horizontal Scroll 
                Desktop: Grid 
            */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <CupertinoActivityIndicator size={28} />
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                    {listings.map((item) => (
                        <div key={item.id} className="min-w-[260px] md:min-w-0">
                            <ListingCard
                                id={item.id}
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
            )}
        </section>
    )
}
