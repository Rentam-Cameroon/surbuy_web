"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import RequestCard from "@/components/request/RequestCard"
import { Button } from "@/components/ui/button"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { requestService } from "@/lib/requestService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useRequestCache } from "@/contexts/RequestCacheContext"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { VerificationDialog } from "@/components/dialogs/VerificationDialog"

export default function RequestPage() {
    const router = useRouter()
    const { getRequests, setRequests } = useRequestCache()
    const { user, isAuthenticated, isLoading } = useAuthStore()
    const [requests, setRequestsState] = useState<any[]>([])
    const [isLoadingRequests, setIsLoadingRequests] = useState(true)
    const [error, setError] = useState("")
    const [dialogType, setDialogType] = useState<"auth" | "kyc" | null>(null)

    useEffect(() => {
        const loadRequests = async () => {
            const cached = getRequests()
            if (cached) {
                setRequestsState(cached)
                setIsLoadingRequests(false)
                return
            }

            try {
                setIsLoadingRequests(true)
                const data = await requestService.listRequests()
                setRequestsState(data)
                setRequests(data)
            } catch (err: any) {
                setError(err.message || "Failed to load requests")
            } finally {
                setIsLoadingRequests(false)
            }
        }

        loadRequests()
    }, [getRequests, setRequests])

    const canRespond = useMemo(() => {
        if (!isAuthenticated || !user) return false
        return user.kyc_status === "approved" && (user.kyc_tier ?? 0) >= 1
    }, [isAuthenticated, user])

    const handleRespond = (requestId: string, responseType: "have_product" | "know_someone") => {
        if (isLoading) return
        if (!isAuthenticated) {
            setDialogType("auth")
            return
        }
        if (!canRespond) {
            setDialogType("kyc")
            return
        }
        router.push(`/sell/requests/respond?requestId=${requestId}&responseType=${responseType}`)
    }

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

            {error && (
                <div className="mb-4 p-3 text-sm rounded-xl border border-destructive/30 text-destructive bg-destructive/10">
                    {error}
                </div>
            )}

            {isLoadingRequests ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <CupertinoActivityIndicator size={40} />
                </div>
            ) : requests.length > 0 ? (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <RequestCard key={request.id} request={request} onRespond={handleRespond} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No requests yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                        Be the first to post what you are looking for.
                    </p>
                    <Link href="/request/create">
                        <Button>Create Request</Button>
                    </Link>
                </div>
            )}

            <div className="fixed bottom-28 right-4 z-40">
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

            <VerificationDialog
                open={dialogType !== null}
                onOpenChange={(open) => !open && setDialogType(null)}
                type={dialogType ?? "auth"}
            />

            <FloatingNavbar />
        </div>
    )
}
