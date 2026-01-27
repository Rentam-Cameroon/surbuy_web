"use client"

import { useKYCStore } from "@/store/useKYCStore"
import { ShieldCheck, Clock, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authService } from "@/lib/authService"
import { Modal } from "@/components/ui/modal"

export default function KYCOverlay() {
    const { documents, setKYCData, isFetched } = useKYCStore()
    const [isVisible, setIsVisible] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const checkStatus = async () => {
        try {
            setIsRefreshing(true)
            const data = await authService.getKYCStatus()
            setKYCData(data)
        } catch (err) {
            console.error("Failed to check KYC status:", err)
        } finally {
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        if (!isFetched) {
            checkStatus()
        }
    }, [isFetched])

    useEffect(() => {
        if (!isFetched) return

        const idApproved = documents.id_front.status === 'approved'
        const selfieApproved = documents.selfie.status === 'approved'

        // Show overlay if either ID or Selfie is NOT approved
        setIsVisible(!(idApproved && selfieApproved))
    }, [documents, isFetched])

    if (!isVisible) return null

    const getOveralStatus = () => {
        const statuses = [
            documents.id_front.status,
            documents.id_back.status,
            documents.selfie.status
        ]

        if (statuses.some(s => s === 'rejected')) return 'rejected'
        if (statuses.some(s => s === 'pending')) return 'pending'
        return 'not_submitted'
    }

    const status = getOveralStatus()

    const title = status === 'rejected' ? "Verification Rejected" :
        status === 'pending' ? "Verification Pending" :
            "Verification Required"

    const description = status === 'rejected' ? "One or more of your documents were rejected. Please review and resubmit." :
        status === 'pending' ? "We're currently reviewing your documents. This usually takes less than 24 hours." :
            "To start selling on Surbuy, you need to complete a quick identity verification."

    return (
        <Modal
            isOpen={isVisible}
            onClose={() => { }} // Non-dismissible
            title={title}
            description={description}
            showBorder={false}
        >
            <div className="space-y-6 pt-2">
                <div className="flex justify-center">
                    <div className={cn(
                        "h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-inner",
                        status === 'rejected' ? "bg-destructive/10 text-destructive" :
                            status === 'pending' ? "bg-blue-500/10 text-blue-600" :
                                "bg-primary/10 text-primary"
                    )}>
                        {status === 'rejected' ? <AlertTriangle className="h-10 w-10" /> :
                            status === 'pending' ? <Clock className="h-10 w-10" /> :
                                <ShieldCheck className="h-10 w-10" />}
                    </div>
                </div>

                <div className="grid gap-3">
                    {status === 'pending' ? (
                        <Button
                            onClick={checkStatus}
                            disabled={isRefreshing}
                            className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 gap-2"
                        >
                            <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
                            {isRefreshing ? "Refreshing..." : "Refresh Status"}
                        </Button>
                    ) : (
                        <Link href="/kyc" className="w-full">
                            <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 gap-2">
                                {status === 'rejected' ? "Fix Documents" : "Verify Now"}
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </Modal>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
