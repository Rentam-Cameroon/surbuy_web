const DYNAMIC_TASK_URL = '/api/auth/dynamic-task'
const SUPER_WORKER_URL = '/api/auth/check-user'

export type AuthStep = 'send_otp' | 'verify_otp' | 'signup'

interface AuthPayload {
    phone?: string
    email?: string
    otp?: string
    password?: string
    full_name?: string
    location_city?: string
    neighborhood?: string
    is_phone_verified?: boolean
    is_email_verified?: boolean
    bio?: string
    image_base64?: string
    image_ext?: string
    step: AuthStep
}

export const authService = {
    async checkUser(phone: string) {
        const response = await fetch(SUPER_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        })
        if (!response.ok) throw new Error('Failed to check user')
        return response.json()
    },

    async dynamicTask(payload: AuthPayload) {
        const response = await fetch(DYNAMIC_TASK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.error || 'Authentication error')
        }
        return response.json()
    },

    async uploadKYCDocument(docType: string, fileBase64: string, fileExt: string, docName?: string) {
        const response = await fetch('/api/kyc/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docType, fileBase64, fileExt, docName })
        })
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.error || 'Upload failed')
        }
        return response.json()
    },

    async getKYCStatus() {
        const response = await fetch('/api/kyc/status', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) throw new Error('Failed to fetch KYC status')
        return response.json()
    },

    async getUserKYCStatus() {
        const response = await fetch('/api/kyc/user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        if (!response.ok) throw new Error('Failed to fetch user KYC status')
        return response.json()
    }
}
