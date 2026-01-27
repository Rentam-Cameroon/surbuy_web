"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CupertinoActivityIndicatorProps {
    size?: number
    color?: string
    className?: string
}

export function CupertinoActivityIndicator({
    size = 36,
    color = "#8E8E93",
    className,
}: CupertinoActivityIndicatorProps) {
    const barCount = 12

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            {[...Array(barCount)].map((_, i) => {
                // Rotation for each bar: 360 / 12 = 30 degrees
                const rotation = i * 30

                // Keyframe animation with delayed start for each bar
                const animationDelay = `${(i - barCount) * (1 / barCount)}s`

                return (
                    <div
                        key={i}
                        className="absolute h-[30%] w-[8%] animate-cupertino-fade rounded-full"
                        style={{
                            backgroundColor: color,
                            transform: `rotate(${rotation}deg) translateY(-80%)`,
                            animationDelay: animationDelay,
                            opacity: 0.3,
                        }}
                    />
                )
            })}

            <style jsx>{`
        @keyframes cupertino-fade {
          0% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        .animate-cupertino-fade {
          animation: cupertino-fade 1s linear infinite;
        }
      `}</style>
        </div>
    )
}
