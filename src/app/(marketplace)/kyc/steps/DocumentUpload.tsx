import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, Check, ShieldCheck, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function DocumentUpload() {
    const { setIdFrontFile, setIdBackFile, idFrontFile, idBackFile, documents } = useKYCStore()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const status = type === 'front' ? documents.id_front.status : documents.id_back.status
        if (status === 'approved' || status === 'pending') return

        if (e.target.files && e.target.files[0]) {
            if (type === 'front') setIdFrontFile(e.target.files[0])
            else setIdBackFile(e.target.files[0])
        }
    }

    const getStatusUI = (status: string) => {
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
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2 text-destructive font-bold text-xs bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                            <XCircle className="h-3 w-3" /> Rejected
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const renderUploadZone = (type: 'front' | 'back', file: File | null, status: string, reason?: string) => {
        const isSubmitted = status === 'approved' || status === 'pending'

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {type === 'front' ? 'Front Side' : 'Back Side'}
                    </Label>
                    {getStatusUI(status)}
                </div>

                {status === 'rejected' && reason && (
                    <p className="text-[10px] text-destructive font-medium bg-destructive/5 p-2 rounded-lg border border-destructive/10 mb-2 italic">
                        Reason: {reason}
                    </p>
                )}

                <div className={cn(
                    "relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all overflow-hidden",
                    file || isSubmitted ? "border-green-500 bg-green-500/5 shadow-inner" : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50",
                    isSubmitted && "cursor-not-allowed opacity-80"
                )}>
                    {!isSubmitted && (
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => handleFileChange(e, type)}
                            accept="image/*"
                        />
                    )}

                    {isSubmitted ? (
                        <div className="flex flex-col items-center text-green-600">
                            <ShieldCheck className="h-10 w-10 mb-2 opacity-50" />
                            <p className="font-bold text-sm">Document Securely Stored</p>
                            <p className="text-[10px] opacity-70">Cannot be modified while {status}</p>
                        </div>
                    ) : file ? (
                        <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                            <Check className="h-10 w-10 mb-2" />
                            <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] opacity-70">Click to replace</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                            <UploadCloud className="h-10 w-10 mb-2 opacity-40" />
                            <p className="font-bold text-sm">Upload {type === 'front' ? 'Front' : 'Back'} Side</p>
                            <p className="text-[10px] opacity-50">JPG, PNG or PDF</p>
                        </div>
                    )}
                </div>
            </div>
        )
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
                {renderUploadZone('front', idFrontFile, documents.id_front.status, documents.id_front.rejection_reason)}
                {renderUploadZone('back', idBackFile, documents.id_back.status, documents.id_back.rejection_reason)}
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
