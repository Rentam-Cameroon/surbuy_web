"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { messages, Locale } from "@/i18n/messages"

type I18nContextValue = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const normalizeLocale = (value?: string | null): Locale => {
    if (!value) return "en"
    const lower = value.toLowerCase()
    if (lower.startsWith("fr")) return "fr"
    if (lower.startsWith("en")) return "en"
    return "en"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en")

    useEffect(() => {
        const stored = localStorage.getItem("locale")
        const detected = normalizeLocale(stored || navigator.language)
        setLocaleState(detected)
        document.documentElement.lang = detected
    }, [])

    const setLocale = (next: Locale) => {
        setLocaleState(next)
        localStorage.setItem("locale", next)
        document.documentElement.lang = next
    }

    const t = useMemo(() => {
        const dict = messages[locale] || {}
        return (key: string) => dict[key] || key
    }, [locale])

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export const useI18n = () => {
    const ctx = useContext(I18nContext)
    if (!ctx) {
        throw new Error("useI18n must be used within I18nProvider")
    }
    return ctx
}
