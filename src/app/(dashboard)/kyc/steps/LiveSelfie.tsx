import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion } from "framer-motion"
import { Camera, RefreshCcw } from "lucide-react"
import { useRef, useState, useCallback, useEffect } from "react"

export default function LiveSelfie() {
    const { setSelfieFile } = useKYCStore()
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [instruction, setInstruction] = useState("Center your face")

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err) {
            console.error("Error accessing camera", err)
            setInstruction("Camera access denied")
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    useEffect(() => {
        startCamera()
        return () => stopCamera()
    }, [])

    // Simulate liveness check instructions
    useEffect(() => {
        if (!imgSrc) {
            const instructions = ["Center your face", "Turn slowly to the left", "Look straight", "Smile!"]
            let i = 0
            const interval = setInterval(() => {
                setInstruction(instructions[i % instructions.length])
                i++
            }, 2000)
            return () => clearInterval(interval)
        }
    }, [imgSrc])

    const capture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 640, 480)
                const imageSrc = canvasRef.current.toDataURL('image/jpeg')
                setImgSrc(imageSrc)

                // Convert to file for store (mocking file creation from base64)
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
                        setSelfieFile(file)
                    })

                stopCamera()
            }
        }
    }, [setSelfieFile])

    const retake = () => {
        setImgSrc(null)
        startCamera()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Live Selfie Check</h2>
                <p className="text-sm text-muted-foreground">
                    We need to verify that you are a real person.
                </p>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center">
                {!imgSrc ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border-[3px] border-dashed border-white/50 rounded-full w-48 h-64 m-auto pointer-events-none" />
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="inline-block bg-black/60 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                                {instruction}
                            </span>
                        </div>
                    </>
                ) : (
                    <img src={imgSrc} alt="captured" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <canvas ref={canvasRef} width={640} height={480} className="hidden" />
            </div>

            <div className="flex justify-center pt-2">
                {!imgSrc ? (
                    <Button size="lg" className="rounded-full w-16 h-16 p-0 border-4 border-white/20" onClick={capture}>
                        <div className="w-12 h-12 bg-white rounded-full" />
                    </Button>
                ) : (
                    <Button variant="outline" onClick={retake} className="gap-2">
                        <RefreshCcw className="h-4 w-4" /> Retake
                    </Button>
                )}
            </div>
        </motion.div>
    )
}
