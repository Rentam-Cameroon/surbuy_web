"use client"

export const COOKIE_NAME = 'auth_token'

export function setTokenCookie(token: string) {
    // Set cookie that expires in 7 days
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `${COOKIE_NAME}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`
}

export function removeTokenCookie() {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null
    const name = COOKIE_NAME + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return null
}

export function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1]
        if (!base64Url) return null
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        return JSON.parse(jsonPayload)
    } catch {
        return null
    }
}

export function getUserIdFromToken(token?: string | null) {
    if (!token) return null
    const payload = parseJwt(token)
    return payload?.sub || payload?.user_id || null
}

export function getUserIdFromCookie() {
    const token = getTokenFromCookie()
    return getUserIdFromToken(token)
}
