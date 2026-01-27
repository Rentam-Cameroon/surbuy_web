"use client"

import { Button } from "@/components/ui/button"
import { useKYCStore } from "@/store/useKYCStore"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, RefreshCw, CheckCircle2, User, AlertCircle, Clock, XCircle, ShieldCheck } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function LiveSelfie() {
    const { setSelfieFile, selfieFile, documents } = useKYCStore()
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [preview, setPreview] = useState<string | null>(selfieFile ? URL.createObjectURL(selfieFile) : null)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const isSubmitted = documents.selfie.status === 'approved' || documents.selfie.status === 'pending'

    const startCamera = async () => {
        if (isSubmitted) return
        try {
            setError(null)
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } }
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err)
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Camera access was denied. Please click the camera icon in your browser address bar to allow access and then refresh.")
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError("No camera found on this device.")
            } else {
                setError("Could not access camera. Please check your system settings and browser permissions.")
            }
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current
            const video = videoRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
                        setSelfieFile(file)
                        setPreview(URL.createObjectURL(file))
                        stopCamera()
                    }
                }, "image/jpeg", 0.9)
            }
        }
    }

    useEffect(() => {
        if (!selfieFile && !isSubmitted) startCamera()
        return () => stopCamera()
    }, [isSubmitted])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Face Verification</h2>
                <p className="text-muted-foreground text-sm">
                    Hold your phone at eye level and make sure your face is clearly visible.
                </p>

                {documents.selfie.status !== 'none' && (
                    <div className="flex justify-center mt-2">
                        {documents.selfie.status === 'approved' && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                <CheckCircle2 className="h-3 w-3" /> Approved
                            </div>
                        )}
                        {documents.selfie.status === 'pending' && (
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <Clock className="h-3 w-3" /> Under Review
                            </div>
                        )}
                        {documents.selfie.status === 'rejected' && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-destructive font-bold text-xs bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                                    <XCircle className="h-3 w-3" /> Rejected
                                </div>
                                {documents.selfie.rejection_reason && (
                                    <p className="text-[10px] text-destructive italic max-w-[200px]">
                                        Reason: {documents.selfie.rejection_reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative aspect-square max-w-[300px] mx-auto rounded-full overflow-hidden border-4 border-primary/20 bg-muted/30 shadow-2xl">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="submitted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full flex flex-col items-center justify-center bg-green-500/10"
                        >
                            <ShieldCheck className="h-16 w-16 text-green-600 opacity-50 mb-2" />
                            <p className="text-xs font-bold text-green-700">Verified Capture</p>
                        </motion.div>
                    ) : preview ? (
                        <motion.img
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={preview}
                            alt="Selfie Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <motion.video
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                    )}
                </AnimatePresence>

                {!preview && !error && !isSubmitted && (
                    <div className="absolute inset-0 border-[16px] border-transparent border-t-primary/20 border-b-primary/20 rounded-full animate-pulse" />
                )
                }

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-muted/80 backdrop-blur-sm">
                        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                        <p className="text-xs font-bold text-destructive">{error}</p>
                        <Button variant="outline" size="sm" onClick={startCamera} className="mt-4 rounded-full">
                            Try Again
                        </Button>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {!isSubmitted && (preview ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
                        <CheckCircle2 className="h-5 w-5" />
                        Capture Successful
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPreview(null); setSelfieFile(null); startCamera(); }}
                        className="text-muted-foreground hover:text-primary transition-colors gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retake Photo
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <Button
                        size="lg"
                        onClick={capturePhoto}
                        className="h-16 w-16 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all p-0"
                    >
                        <div className="h-12 w-12 rounded-full border-4 border-white flex items-center justify-center" />
                    </Button>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        <User className="h-3 w-3" />
                        Look directly at the camera
                    </div>
                </div>
            ))}
        </motion.div>
    )
}
