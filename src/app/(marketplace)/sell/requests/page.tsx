"use client"

import { useEffect, useState } from "react"
import RequestCard from "@/components/request/RequestCard"
import FloatingNavbar from "@/components/marketplace/FloatingNavbar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { requestService } from "@/lib/requestService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"
import { useRequestCache } from "@/contexts/RequestCacheContext"
import { useAuthStore } from "@/store/useAuthStore"
import { VerificationDialog } from "@/components/dialogs/VerificationDialog"
import { authService } from "@/lib/authService"
import { useI18n } from "@/contexts/I18nContext"

export default function SellerRequestsPage() {
    const router = useRouter()
    const { getRequests, setRequests } = useRequestCache()
    const { isAuthenticated, isLoading } = useAuthStore()
    const { t } = useI18n()
    const [requests, setRequestsState] = useState<any[]>([])
    const [isLoadingRequests, setIsLoadingRequests] = useState(true)
    const [error, setError] = useState("")
    const [dialogType, setDialogType] = useState<"auth" | "kyc" | null>(null)
    const [isCheckingKyc, setIsCheckingKyc] = useState(false)

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
                setError(err.message || t("Failed to load requests"))
            } finally {
                setIsLoadingRequests(false)
            }
        }

        loadRequests()
    }, [getRequests, setRequests, t])

    const handleRespond = async (requestId: string, responseType: "i_have_this" | "i_know_someone") => {
        if (isLoading || isCheckingKyc) return
        if (!isAuthenticated) {
            setDialogType("auth")
            return
        }
        setIsCheckingKyc(true)
        try {
            const data = await authService.getUserKYCStatus()
            const isApproved = data.kyc_status === "approved" && (data.kyc_tier ?? 0) >= 1
            if (!isApproved) {
                setDialogType("kyc")
                return
            }
            router.push(`/sell/requests/respond?requestId=${requestId}&responseType=${responseType}`)
        } catch {
            setDialogType("kyc")
        } finally {
            setIsCheckingKyc(false)
        }
    }

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
                    <h1 className="text-2xl font-bold tracking-tight">{t("Buyer Requests")}</h1>
                    <p className="text-muted-foreground text-sm">{t("Find items people are looking for and respond")}</p>
                </div>
            </header>

            {error && (
                <div className="mb-4 p-3 text-sm rounded-xl border border-destructive/30 text-destructive bg-destructive/10">
                    {error}
                </div>
            )}

            {isLoadingRequests ? (
                <div className="flex justify-center py-10">
                    <CupertinoActivityIndicator size={24} />
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
                    <h3 className="text-lg font-semibold">{t("No requests yet")}</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        {t("Check back later for new buyer requests.")}
                    </p>
                </div>
            )}

            <VerificationDialog
                open={dialogType !== null}
                onOpenChange={(open) => !open && setDialogType(null)}
                type={dialogType ?? "auth"}
            />

            <FloatingNavbar />
        </div>
    )
}
