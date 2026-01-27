import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"

import { ArrowLeft } from "lucide-react"

export default function StepBasicInfo() {
    const { fullName, city, neighborhood, setFullName, setCity, setNeighborhood, setStep } = useRegistrationStore()

    const handleNext = () => {
        // Validation removed as requested
        setStep(3)
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
                        onClick={() => setStep(1)}
                        className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Basic Information</h1>
                <p className="text-muted-foreground text-sm">
                    You are almost done. Completing your profile helps protect your trades.
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option value="" disabled>Select a city</option>
                        <option value="Douala">Douala</option>
                        <option value="Yaoundé">Yaoundé</option>
                        <option value="Bamenda">Bamenda</option>
                        <option value="Buea">Buea</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Neighborhood (Optional)</label>
                    <Input
                        placeholder="Akwa, Bonapriso..."
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                    />
                </div>

                <div className="flex justify-center pt-4">
                    <Button className="min-w-[200px] h-12 rounded-xl" size="lg" onClick={handleNext}>
                        Continue
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
