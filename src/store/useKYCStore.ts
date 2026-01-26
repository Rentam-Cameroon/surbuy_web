import { create } from 'zustand'

interface KYCState {
    tier: 1 | 2
    idFront: File | null
    idBack: File | null
    selfieFile: File | null
    taxFile: File | null
    setTier: (tier: 1 | 2) => void
    setIdFront: (file: File | null) => void
    setIdBack: (file: File | null) => void
    setSelfieFile: (file: File | null) => void
    setTaxFile: (file: File | null) => void
    reset: () => void
}

export const useKYCStore = create<KYCState>((set) => ({
    tier: 1,
    idFront: null,
    idBack: null,
    selfieFile: null,
    taxFile: null,
    setTier: (tier) => set({ tier }),
    setIdFront: (file) => set({ idFront: file }),
    setIdBack: (file) => set({ idBack: file }),
    setSelfieFile: (file) => set({ selfieFile: file }),
    setTaxFile: (file) => set({ taxFile: file }),
    reset: () => set({
        tier: 1,
        idFront: null,
        idBack: null,
        selfieFile: null,
        taxFile: null
    })
})
)
