import { Button } from "@/components/ui/button"
import { useRegistrationStore } from "@/store/useRegistrationStore"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Store } from "lucide-react"

export default function StepChoice() {
    const { fullName, setStep } = useRegistrationStore()
    const router = useRouter()

    const handleChoice = (type: 'buy' | 'sell') => {
        // Save to DB logic would go here
        if (type === 'sell') {
            router.push('/kyc')
        } else {
            router.push('/dashboard') // Or Main Market Page
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center"
        >
            <div className="flex justify-start mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(5)}
                    className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">You're all set, {fullName.split(' ')[0]}!</h1>
                <p className="text-muted-foreground text-lg">
                    What would you like to do first?
                </p>
            </div>

            <div className="grid gap-4">
                <Button
                    variant="outline"
                    className="h-auto p-6 flex items-center justify-start gap-4 hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => handleChoice('buy')}
                >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">I want to Buy</div>
                        <div className="text-sm text-muted-foreground">Explore listings and find great deals</div>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto p-6 flex items-center justify-start gap-4 hover:border-primary hover:bg-primary/5 transition-all group"
                    onClick={() => handleChoice('sell')}
                >
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Store className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">I want to Sell</div>
                        <div className="text-sm text-muted-foreground">Start selling your items instantly</div>
                    </div>
                </Button>
            </div>
        </motion.div>
    )
}
