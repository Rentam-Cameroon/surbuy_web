import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"

export default function StepBasicInfo() {
    const { fullName, city, neighborhood, setFullName, setCity, setNeighborhood, setStep } = useRegistrationStore()

    const handleNext = () => {
        // Validation removed as requested
        setStep(2)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Let's start</h1>
                <p className="text-muted-foreground">
                    Tell us a bit about yourself.
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

                <div className="flex justify-center">
                    <Button className="min-w-[200px]" size="lg" onClick={handleNext}>
                        Continue
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
