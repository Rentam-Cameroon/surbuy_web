import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { UploadCloud, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function TaxDocument() {
    const { setTaxFile, taxFile } = useKYCStore()
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
            setTaxFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setTaxFile(e.target.files[0])
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Address / Tax Verification</h2>
                <p className="text-sm text-muted-foreground">
                    Required for Green Badge (Tier 2). Upload a recent utility bill or tax document.
                </p>
            </div>

            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-colors",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    taxFile ? "border-green-500 bg-green-500/5" : "bg-muted/30"
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

                {taxFile ? (
                    <div className="flex flex-col items-center text-green-600">
                        <Check className="h-10 w-10 mb-2" />
                        <p className="font-medium">{taxFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(taxFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <UploadCloud className="h-10 w-10 mb-2" />
                        <p className="font-medium">Click or drag file here</p>
                        <p className="text-xs">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
