import { create } from 'zustand'
import { setTokenCookie, removeTokenCookie, getTokenFromCookie } from '@/lib/auth-utils'

interface User {
    id: string
    full_name: string
    phone: string
    email?: string
    avatar_url?: string
    profile_image_url?: string
    reg_status: string
    is_phone_verified: boolean
    is_email_verified: boolean
    kyc_status?: string
    kyc_tier?: number
    is_admin?: boolean
    bio?: string
    created_at?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean

    login: (token: string, user: User) => void
    logout: () => void
    init: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    login: (token, user) => {
        setTokenCookie(token)
        localStorage.setItem('user_data', JSON.stringify(user))
        set({ user, token, isAuthenticated: true, isLoading: false })
    },

    logout: () => {
        removeTokenCookie()
        localStorage.removeItem('user_data')
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    },

    init: () => {
        const token = getTokenFromCookie()
        const storedUser = localStorage.getItem('user_data')

        if (token && storedUser) {
            try {
                set({
                    user: JSON.parse(storedUser),
                    token,
                    isAuthenticated: true,
                    isLoading: false
                })
            } catch (e) {
                set({ isLoading: false })
            }
        } else {
            set({ isLoading: false })
        }
    }
}))
