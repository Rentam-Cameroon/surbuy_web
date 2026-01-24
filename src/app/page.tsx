"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SplashScreen from "@/components/pwa/SplashScreen"

export default function RootPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Simulate Splash Screen delay and check onboarding status
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")

      if (hasSeenOnboarding === "true") {
        router.push("/register") // Or login, per user request "go to signup"
      } else {
        router.push("/onboarding")
      }
    }, 2500) // 2.5s splash

    return () => clearTimeout(timer)
  }, [router])

  if (showSplash) {
    return <SplashScreen />
  }

  return null
}
