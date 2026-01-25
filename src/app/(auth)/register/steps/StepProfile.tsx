import { Button } from "@/components/ui/button"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft, Camera, User } from "lucide-react"
export default function StepProfile() {
    const { bio, setBio, setProfileImage, profileImage, setStep } = useRegistrationStore()
    const [preview, setPreview] = useState<string | null>(profileImage ? URL.createObjectURL(profileImage) : null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setProfileImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleNext = () => {
        setStep(4)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <div className="flex justify-start mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(2)}
                        className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Add a photo</h1>
                <p className="text-muted-foreground text-sm">
                    Optional, but it helps buyers and sellers trust you faster.
                </p>
            </div>

            <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                    <div className={cn(
                        "w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors",
                        preview ? "border-primary" : "border-muted-foreground/30 bg-muted/30"
                    )}>
                        {preview ? (
                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-muted-foreground" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg">
                        <Camera className="h-4 w-4" />
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Bio (Optional)</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 justify-center">
                    <Button variant="outline" className="w-32" onClick={handleNext}>
                        Skip
                    </Button>
                    <Button className="w-32" onClick={handleNext}>
                        Continue
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
