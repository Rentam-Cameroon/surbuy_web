"use client"

import { useKYCStore } from "@/store/useKYCStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import DocumentUpload from "./steps/DocumentUpload"
import LiveSelfie from "./steps/LiveSelfie"
import TaxDocument from "./steps/TaxDocument"
import { authService } from "@/lib/authService"
import { CupertinoActivityIndicator } from "@/components/ui/cupertino-activity-indicator"

export default function KYCPage() {
    const {
        documents,
        idFrontFile,
        idBackFile,
        selfieFile,
        taxFile,
        setKYCData
    } = useKYCStore()
    const [currentStep, setCurrentStep] = useState(1) // 1: ID, 2: Selfie, 3: Tax, 4: Success
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const fetchKYCStatus = useCallback(async () => {
        try {
            const data = await authService.getKYCStatus()
            setKYCData(data)
        } catch (err) {
            console.error("Failed to fetch KYC status:", err)
        }
    }, [setKYCData])

    useEffect(() => {
        fetchKYCStatus()
    }, [fetchKYCStatus])

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64 = reader.result as string
                resolve(base64.split(',')[1]) // Remove data:image/jpeg;base64,
            }
            reader.onerror = error => reject(error)
        })
    }

    const handleNext = async () => {
        setError(null)
        if (currentStep === 1) {
            // ID Upload (Front & Back)
            const idFrontApprovedOrPending = documents.id_front.status === 'approved' || documents.id_front.status === 'pending'
            const idBackApprovedOrPending = documents.id_back.status === 'approved' || documents.id_back.status === 'pending'

            // Priority 1: Both already submitted -> Move on
            if (idFrontApprovedOrPending && idBackApprovedOrPending) {
                setCurrentStep(2)
                return
            }

            // Priority 2: Front needs upload
            if (!idFrontApprovedOrPending && idFrontFile) {
                try {
                    setIsUploading(true)
                    const base64Front = await fileToBase64(idFrontFile)
                    const extFront = idFrontFile.name.split('.').pop() || 'jpg'

                    // Upload Front
                    await authService.uploadKYCDocument('id_card', base64Front, extFront, 'front')

                    // Upload Back if requested and not already submitted
                    if (idBackFile && !idBackApprovedOrPending) {
                        const base64Back = await fileToBase64(idBackFile)
                        const extBack = idBackFile.name.split('.').pop() || 'jpg'
                        await authService.uploadKYCDocument('id_card', base64Back, extBack, 'back')
                    }

                    await fetchKYCStatus()
                    setCurrentStep(2)
                } catch (err: any) {
                    setError(err.message || 'Upload failed')
                } finally {
                    setIsUploading(false)
                }
            }
            // Priority 3: Front is done, check Back only
            else if (idFrontApprovedOrPending && !idBackApprovedOrPending && idBackFile) {
                try {
                    setIsUploading(true)
                    const base64Back = await fileToBase64(idBackFile)
                    const extBack = idBackFile.name.split('.').pop() || 'jpg'
                    await authService.uploadKYCDocument('id_card', base64Back, extBack, 'back')
                    await fetchKYCStatus()
                    setCurrentStep(2)
                } catch (err: any) {
                    setError(err.message || 'Back ID upload failed')
                } finally {
                    setIsUploading(false)
                }
            }
            // Priority 4: Front is done, no Back needed/selected
            else if (idFrontApprovedOrPending) {
                setCurrentStep(2)
            }
            else {
                setError('Please upload at least the front side of your ID')
            }
        }
        else if (currentStep === 2) {
            // Selfie Upload
            const selfieApprovedOrPending = documents.selfie.status === 'approved' || documents.selfie.status === 'pending'

            if (!selfieApprovedOrPending && selfieFile) {
                try {
                    setIsUploading(true)
                    const base64 = await fileToBase64(selfieFile)
                    const ext = selfieFile.name.split('.').pop() || 'jpg'
                    await authService.uploadKYCDocument('selfie', base64, ext)
                    await fetchKYCStatus()
                    setCurrentStep(3)
                } catch (err: any) {
                    setError(err.message || 'Upload failed')
                } finally {
                    setIsUploading(false)
                }
            } else if (selfieApprovedOrPending) {
                setCurrentStep(3)
                return
            } else {
                setError('Please take a selfie to continue')
            }
        } else if (currentStep === 3) {
            // Tax Document Upload (Optional)
            const taxApprovedOrPending = documents.tax_document.status === 'approved' || documents.tax_document.status === 'pending'

            if (!taxApprovedOrPending && taxFile) {
                try {
                    setIsUploading(true)
                    const base64 = await fileToBase64(taxFile)
                    const ext = taxFile.name.split('.').pop() || 'jpg'
                    await authService.uploadKYCDocument('tax_document', base64, ext)
                    await fetchKYCStatus()
                    setCurrentStep(4)
                } catch (err: any) {
                    setError(err.message || 'Upload failed')
                } finally {
                    setIsUploading(false)
                }
            } else {
                // Skips or already approved/pending
                setCurrentStep(4)
            }
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <DocumentUpload />
            case 2:
                return <LiveSelfie />
            case 3:
                return <TaxDocument onComplete={handleNext} />
            case 4:
                return (
                    <div className="text-center space-y-6 py-8">
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-100 p-4 rounded-full"
                            >
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </motion.div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Verification Submitted</h2>
                            <p className="text-muted-foreground">Your verification is being processed. You'll be redirected to your dashboard shortly.</p>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    useEffect(() => {
        if (currentStep === 4) {
            const timer = setTimeout(() => {
                router.push("/sell")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [currentStep, router])

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                        <CupertinoActivityIndicator size={48} color="#8E8E93" />
                        <p className="mt-4 font-medium text-muted-foreground animate-pulse">Processing documents...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto space-y-8 relative">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (currentStep > 1) setCurrentStep(currentStep - 1)
                                else router.back()
                            }}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-primary">Seller Verification</h1>
                    </div>
                    {currentStep < 4 && (
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Step {currentStep} of 3
                        </div>
                    )}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <Card className="glass shadow-xl overflow-hidden">
                    <CardContent className="p-0 min-h-[450px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                className="p-6 md:p-10"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderCurrentStep()}
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {currentStep < 3 && (
                    <div className="flex justify-between gap-4">
                        <Button
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-bold"
                            onClick={() => {
                                if (currentStep > 1) setCurrentStep(currentStep - 1)
                                else router.back()
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            className="flex-1 h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                            onClick={handleNext}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
