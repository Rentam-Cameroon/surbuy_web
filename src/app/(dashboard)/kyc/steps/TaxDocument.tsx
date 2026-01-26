"use client"

import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, FileText, Check, AlertCircle, Info, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"

interface TaxDocumentProps {
    onComplete: () => void
}

export default function TaxDocument({ onComplete }: TaxDocumentProps) {
    const { setTaxFile, taxFile, setTier } = useKYCStore()
    const [showSkipDialog, setShowSkipDialog] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTaxFile(e.target.files[0])
            setTier(2) // Providing document elevates to Green Badge
        }
    }

    const handleSkip = () => {
        setTier(1) // Skipping keeps you at Yellow Badge
        onComplete()
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
                    "relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                    taxFile ? "border-green-500 bg-green-500/5 shadow-inner" : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50"
                )}>
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                    />
                    {taxFile ? (
                        <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                            <Check className="h-10 w-10 mb-2" />
                            <p className="font-bold text-sm">{taxFile.name}</p>
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
                    disabled={!taxFile}
                >
                    Submit & Finish
                </Button>

                <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => setShowSkipDialog(true)}>
                    I don't have this document, skip for now
                </Button>

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
