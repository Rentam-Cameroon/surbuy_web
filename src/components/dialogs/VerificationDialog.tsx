"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface VerificationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type: 'auth' | 'kyc' | 'confirm'
    onConfirm?: () => void
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
}

export function VerificationDialog({
    open,
    onOpenChange,
    type,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel
}: VerificationDialogProps) {
    const router = useRouter()

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        } else if (type === 'auth') {
            router.push('/register')
        } else {
            router.push('/kyc')
        }
        onOpenChange(false)
    }

    const resolvedTitle = title ?? (type === 'auth' ? 'Login Required' : type === 'kyc' ? 'KYC Verification Required' : 'Confirm Action')
    const resolvedDescription = description ?? (
        type === 'auth'
            ? 'You need to be logged in to respond to requests.'
            : type === 'kyc'
                ? 'You need to complete KYC verification (Level 1 or higher) to respond to requests.'
                : 'Please confirm you want to proceed.'
    )
    const resolvedConfirmLabel = confirmLabel ?? (type === 'auth' ? 'Login' : type === 'kyc' ? 'Start KYC' : 'Confirm')
    const resolvedCancelLabel = cancelLabel ?? 'Cancel'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <DialogTitle className="text-center">
                        {resolvedTitle}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {resolvedDescription}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row gap-2 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 rounded-xl"
                    >
                        {resolvedCancelLabel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 rounded-xl"
                    >
                        {resolvedConfirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
