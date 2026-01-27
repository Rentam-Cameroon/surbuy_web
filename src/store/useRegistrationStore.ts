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
    password: string
    profileImage: File | null
    isExistingUser: boolean | null
    regStatus: 'none' | 'incomplete' | 'complete'
    isPhoneVerified: boolean
    isEmailVerified: boolean

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
    setPassword: (password: string) => void
    setProfileImage: (file: File | null) => void
    setRegistrationInfo: (exists: boolean, status: string) => void
    setPhoneVerified: (verified: boolean) => void
    setEmailVerified: (verified: boolean) => void
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
    password: '',
    profileImage: null,
    isExistingUser: null,
    regStatus: 'none',
    isPhoneVerified: false,
    isEmailVerified: false,

    setStep: (step) => set({ step }),
    setUserId: (userId) => set({ userId }),
    setFullName: (fullName) => set({ fullName }),
    setCity: (city) => set({ city }),
    setNeighborhood: (neighborhood) => set({ neighborhood }),
    setPhone: (phone) => set({ phone }),
    setPhoneOtp: (phoneOtp) => set({ phoneOtp }),
    setEmail: (email) => set({ email }),
    setEmailOtp: (emailOtp) => set({ emailOtp }),
    setBio: (bio) => set({ bio }),
    setPassword: (password) => set({ password }),
    setProfileImage: (profileImage) => set({ profileImage }),
    setRegistrationInfo: (exists, status) => set({
        isExistingUser: exists,
        regStatus: status as any
    }),
    setPhoneVerified: (isPhoneVerified) => set({ isPhoneVerified }),
    setEmailVerified: (isEmailVerified) => set({ isEmailVerified }),

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
        password: '',
        profileImage: null,
        isExistingUser: null,
        regStatus: 'none',
        isPhoneVerified: false,
        isEmailVerified: false
    })
})
)
