import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, FileText, Check, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function DocumentUpload() {
    const { setIdFront, setIdBack, idFront, idBack } = useKYCStore()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'front') setIdFront(e.target.files[0])
            else setIdBack(e.target.files[0])
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Identity Verification</h2>
                <p className="text-muted-foreground text-sm">
                    Upload clear photos of both sides of your National ID card or Passport.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Front Side */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Front Side</Label>
                    <div className={cn(
                        "relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                        idFront ? "border-green-500 bg-green-500/5 shadow-inner" : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50"
                    )}>
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => handleFileChange(e, 'front')}
                            accept="image/*"
                        />
                        {idFront ? (
                            <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                                <Check className="h-10 w-10 mb-2" />
                                <p className="font-bold text-sm">{idFront.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-muted-foreground">
                                <UploadCloud className="h-10 w-10 mb-2 opacity-40" />
                                <p className="font-bold text-sm">Upload Front Side</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Side */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Back Side</Label>
                    <div className={cn(
                        "relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                        idBack ? "border-green-500 bg-green-500/5 shadow-inner" : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50"
                    )}>
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => handleFileChange(e, 'back')}
                            accept="image/*"
                        />
                        {idBack ? (
                            <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                                <Check className="h-10 w-10 mb-2" />
                                <p className="font-bold text-sm">{idBack.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-muted-foreground">
                                <UploadCloud className="h-10 w-10 mb-2 opacity-40" />
                                <p className="font-bold text-sm">Upload Back Side</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold">Why verify?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Verification protects our community from fraud and builds trust between buyers and sellers.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
