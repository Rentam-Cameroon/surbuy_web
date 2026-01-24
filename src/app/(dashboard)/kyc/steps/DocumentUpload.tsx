import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, FileText, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DocumentUpload() {
    const { setIdFile, idFile } = useKYCStore()
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setIdFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setIdFile(e.target.files[0])
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Identity Verification</h2>
                <p className="text-sm text-muted-foreground">
                    Upload a clear photo of your ID card or Passport.
                </p>
            </div>

            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-colors",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    idFile ? "border-green-500 bg-green-500/5" : "bg-muted/30"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                />

                {idFile ? (
                    <div className="flex flex-col items-center text-green-600">
                        <Check className="h-10 w-10 mb-2" />
                        <p className="font-medium">{idFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(idFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <UploadCloud className="h-10 w-10 mb-2" />
                        <p className="font-medium">Click or drag file here</p>
                        <p className="text-xs">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex-1 p-3 rounded-lg border bg-card/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">1</div>
                    <div className="text-xs text-muted-foreground">Government issued ID</div>
                </div>
                <div className="flex-1 p-3 rounded-lg border bg-card/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">2</div>
                    <div className="text-xs text-muted-foreground">Original (no photocopy)</div>
                </div>
            </div>
        </motion.div>
    )
}
