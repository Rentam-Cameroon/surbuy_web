"use client"

import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, Check, Info, Clock, XCircle, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"

interface TaxDocumentProps {
    onComplete: () => void
}

export default function TaxDocument({ onComplete }: TaxDocumentProps) {
    const { setTaxFile, taxFile, setTier, documents } = useKYCStore()
    const [showSkipDialog, setShowSkipDialog] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const isSubmitted = documents.tax_document.status === 'approved' || documents.tax_document.status === 'pending'

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSubmitted) return
        if (e.target.files && e.target.files[0]) {
            setTaxFile(e.target.files[0])
            setTier(2) // Providing document elevates to Green Badge
        }
    }

    const handleSkip = () => {
        if (isSubmitted) return
        setTier(1) // Skipping keeps you at Yellow Badge
        onComplete()
    }

    const getStatusUI = () => {
        const { status, rejection_reason } = documents.tax_document
        switch (status) {
            case 'approved':
                return (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <Check className="h-3 w-3" /> Approved
                    </div>
                )
            case 'pending':
                return (
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <Clock className="h-3 w-3" /> Under Review
                    </div>
                )
            case 'rejected':
                return (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-destructive font-bold text-xs bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                            <XCircle className="h-3 w-3" /> Rejected
                        </div>
                        {rejection_reason && (
                            <p className="text-[10px] text-destructive italic text-center max-w-[200px]">
                                Reason: {rejection_reason}
                            </p>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Tax Documentation</h2>
                <p className="text-muted-foreground text-sm">
                    Optionally provide your taxpayer document to unlock pro features.
                </p>
                <div className="flex justify-center mt-2">
                    {getStatusUI()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Taxpayer Document</Label>
                    <button
                        type="button"
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                </div>

                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 leading-relaxed overflow-hidden"
                    >
                        A taxpayer document (like a NIU card or tax clearance) helps verify your business status. This can be obtained from the Directorate General of Taxation. Having this document gives you a <span className="font-bold text-green-600">Green Badge</span>, which signals higher trust to buyers.
                    </motion.div>
                )}

                <div className={cn(
                    "relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all overflow-hidden",
                    taxFile || isSubmitted ? "border-green-500 bg-green-500/5 shadow-inner" : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50",
                    isSubmitted && "cursor-not-allowed opacity-80"
                )}>
                    {!isSubmitted && (
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                        />
                    )}

                    {isSubmitted ? (
                        <div className="flex flex-col items-center text-green-600">
                            <ShieldCheck className="h-10 w-10 mb-2 opacity-50" />
                            <p className="font-bold text-sm">Document Securely Stored</p>
                            <p className="text-[10px] opacity-70">Tax documents are under verification</p>
                        </div>
                    ) : taxFile ? (
                        <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                            <Check className="h-10 w-10 mb-2" />
                            <p className="font-bold text-sm truncate max-w-[200px]">{taxFile.name}</p>
                            <p className="text-[10px] opacity-60">Verified Document Attached</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                            <UploadCloud className="h-10 w-10 mb-2 opacity-40" />
                            <p className="font-bold text-sm">Upload Document</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">PDF, JPG or PNG</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                    onClick={() => onComplete()}
                    disabled={(!taxFile && !isSubmitted)}
                >
                    {isSubmitted ? "Continue" : "Submit & Finish"}
                </Button>

                {!isSubmitted && (
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => setShowSkipDialog(true)}>
                        I don't have this document, skip for now
                    </Button>
                )}

                <Modal
                    isOpen={showSkipDialog}
                    onClose={() => setShowSkipDialog(false)}
                    title="Skip Pro Verification?"
                    description="If you skip this, you will receive a Yellow Badge. You can still sell but will have lower trust scores and monthly transaction limits. Providing this later will upgrade you to a Green Badge."
                >
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-2xl"
                            onClick={() => setShowSkipDialog(false)}
                        >
                            Go Back
                        </Button>
                        <Button
                            className="flex-1 h-12 rounded-2xl font-bold"
                            onClick={handleSkip}
                        >
                            Yes, Skip
                        </Button>
                    </div>
                </Modal>
            </div>
        </motion.div>
    )
}
