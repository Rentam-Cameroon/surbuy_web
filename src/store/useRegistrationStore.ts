import { create } from 'zustand'

interface RegistrationState {
    step: number
    userId: string | null
    fullName: string
    city: string
    neighborhood: string
    phone: string
    phoneOtp: string
    email: string
    emailOtp: string
    bio: string
    profileImage: File | null

    setStep: (step: number) => void
    setUserId: (id: string) => void
    setFullName: (name: string) => void
    setCity: (city: string) => void
    setNeighborhood: (hood: string) => void
    setPhone: (phone: string) => void
    setPhoneOtp: (otp: string) => void
    setEmail: (email: string) => void
    setEmailOtp: (otp: string) => void
    setBio: (bio: string) => void
    setProfileImage: (file: File | null) => void
    reset: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
    step: 1,
    userId: null,
    fullName: '',
    city: '',
    neighborhood: '',
    phone: '',
    phoneOtp: '',
    email: '',
    emailOtp: '',
    bio: '',
    profileImage: null,

    setStep: (step) => set({ step }),
    setUserId: (id) => set({ userId: id }),
    setFullName: (fullName) => set({ fullName }),
    setCity: (city) => set({ city }),
    setNeighborhood: (neighborhood) => set({ neighborhood }),
    setPhone: (phone) => set({ phone }),
    setPhoneOtp: (phoneOtp) => set({ phoneOtp }),
    setEmail: (email) => set({ email }),
    setEmailOtp: (emailOtp) => set({ emailOtp }),
    setBio: (bio) => set({ bio }),
    setProfileImage: (profileImage) => set({ profileImage }),

    reset: () => set({
        step: 1,
        userId: null,
        fullName: '',
        city: '',
        neighborhood: '',
        phone: '',
        phoneOtp: '',
        email: '',
        emailOtp: '',
        bio: '',
        profileImage: null
    })
}))
