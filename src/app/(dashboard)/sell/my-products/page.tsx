"use client"

import { Button } from "@/components/ui/button"
import { Plus, Package, Search, Filter } from "lucide-react"
import Link from "next/link"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { Input } from "@/components/ui/input"

export default function MyProductsPage() {
    return (
        <div className="min-h-screen bg-background pb-32">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">My Products</h1>
                    <Link href="/sell/create">
                        <Button size="sm" className="rounded-full gap-2">
                            <Plus className="h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-6">
                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search your listings..." className="rounded-xl pl-10 bg-muted/30 border-none h-11" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl h-11 w-11">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Empty State / Simulation */}
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">No active listings</h2>
                        <p className="text-sm text-muted-foreground">List your first product to start earning.</p>
                    </div>
                    <Link href="/sell/create">
                        <Button variant="outline" className="rounded-xl">Create Listing</Button>
                    </Link>
                </div>
            </main>

            <FloatingNavbar />
        </div>
    )
}
