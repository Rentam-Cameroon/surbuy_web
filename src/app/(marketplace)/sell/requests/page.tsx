"use client"

import { MOCK_REQUESTS } from "@/lib/mockData"
import RequestCard from "@/components/request/RequestCard"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SellerRequestsPage() {
    const router = useRouter()

    return (
        <div className="pb-32 pt-6 px-4 max-w-2xl mx-auto min-h-screen">
            <header className="mb-6 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Buyer Requests</h1>
                    <p className="text-muted-foreground text-sm">Find items people are looking for and respond</p>
                </div>
            </header>

            <div className="grid gap-4">
                {MOCK_REQUESTS.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}
            </div>

            <FloatingNavbar />
        </div>
    )
}
