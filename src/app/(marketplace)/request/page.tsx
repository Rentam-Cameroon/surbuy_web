"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { MOCK_REQUESTS } from "@/lib/mockData"
import RequestCard from "@/components/request/RequestCard"
import { Button } from "@/components/ui/button"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"

export default function RequestPage() {
    return (
        <div className="pb-32 pt-6 px-4 max-w-2xl mx-auto min-h-screen">
            <header className="mb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Buyer Requests</h1>
                    <p className="text-muted-foreground text-sm">See what others are looking for</p>
                </div>
                <Link href="/request/my-requests">
                    <Button variant="ghost" size="sm" className="text-primary text-lg font-semibold hover:bg-primary/5">
                        My Requests
                    </Button>
                </Link>
            </header>

            <div className="grid gap-4">
                {MOCK_REQUESTS.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}
            </div>

            {/* Floating Action Button for Creating Request */}
            <div className="fixed bottom-24 right-4 z-40">
                <Link href="/request/create">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                        aria-label="Create Request"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </Link>
            </div>

            <FloatingNavbar />
        </div>
    )
}
