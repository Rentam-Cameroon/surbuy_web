import { create } from 'zustand'

interface KYCState {
    tier: 0 | 1 | 2
    idFile: File | null
    selfieFile: File | null
    taxFile: File | null
    setTier: (tier: 0 | 1 | 2) => void
    setIdFile: (file: File | null) => void
    setSelfieFile: (file: File | null) => void
    setTaxFile: (file: File | null) => void
    reset: () => void
}

export const useKYCStore = create<KYCState>((set) => ({
    tier: 0,
    idFile: null,
    selfieFile: null,
    taxFile: null,
    setTier: (tier) => set({ tier }),
    setIdFile: (file) => set({ idFile: file }),
    setSelfieFile: (file) => set({ selfieFile: file }),
    setTaxFile: (file) => set({ taxFile: file }),
    reset: () => set({
        tier: 0,
        idFile: null,
        selfieFile: null,
        taxFile: null
    })
}))
