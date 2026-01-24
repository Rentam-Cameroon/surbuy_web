"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import Image from "next/image"

interface ProductGalleryProps {
    images: string[]
    title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setSelectedIndex((prev) => (prev + 1) % images.length)
    }

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted cursor-zoom-in group"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                            <Maximize2 className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Navigation Arrows (Overlay) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === selectedIndex
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <motion.div
                                key={selectedIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={images[selectedIndex]}
                                    alt={title}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                />
                            </motion.div>

                            {/* Lightbox Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Lightbox Thumbnails */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 p-2 rounded-xl backdrop-blur-md flex gap-2 max-w-[90vw] overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`relative flex-shrink-0 w-12 aspect-square rounded-md overflow-hidden transition-all ${idx === selectedIndex
                                            ? "ring-2 ring-white opacity-100"
                                            : "opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
