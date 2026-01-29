import { getTokenFromCookie } from "./auth-utils"

export interface RequestData {
    title: string
    description: string
    category: string
    max_budget: number
    location_city: string
    neighborhood?: string
}

export interface ResponseData {
    request_id: string
    response_type: 'i_have_this' | 'i_know_someone'
    product_id?: string
    referral_contact?: string
    message: string
}

export const requestService = {
    async createRequest(data: RequestData) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'create_request',
                token,
                ...data
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to create request')
        return resData
    },

    async listRequests() {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'list_requests',
                token
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to list requests')
        return resData.requests
    },

    async listMyRequests() {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'list_my_requests',
                token
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to list your requests')
        return resData.requests
    },

    async updateRequest(requestId: string, updates: Partial<RequestData>) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'update_request',
                token,
                request_id: requestId,
                ...updates
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to update request')
        return resData
    },

    async deleteRequest(requestId: string) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'delete_request',
                token,
                request_id: requestId
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to delete request')
        return resData
    },

    async respondToRequest(data: ResponseData) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'respond_request',
                token,
                ...data
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to send response')
        return resData
    },

    async viewRequestResponses(requestId: string) {
        const token = getTokenFromCookie()
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: 'view_request_responses',
                token,
                request_id: requestId
            })
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || 'Failed to view responses')
        return resData.responses
    }
}
