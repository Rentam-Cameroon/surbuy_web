import { getTokenFromCookie } from "./auth-utils"

export const chatService = {
    async startConversation(params: { product_id?: string; request_id?: string }) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "start_conversation",
                token,
                ...params,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to start conversation")
        return resData.conversation
    },

    async sendMessage(params: { conversation_id: string; message_text: string }) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "send_message",
                token,
                ...params,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to send message")
        return resData.message
    },

    async checkProductConversation(productId: string) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "check_product_conversation",
                token,
                product_id: productId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to check conversation")
        return resData
    },

    async markRead(conversationId: string) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "mark_read",
                token,
                conversation_id: conversationId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to mark read")
        return resData
    },

    async getConversation(conversationId: string) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_conversation",
                token,
                conversation_id: conversationId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load conversation")
        return resData
    },

    async getMessages(conversationId: string) {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "get_messages",
                token,
                conversation_id: conversationId,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load messages")
        return resData.messages || []
    },

    async listMyConversations(type?: "marketplace-messages" | "sell-messages") {
        const token = getTokenFromCookie()
        const response = await fetch("/api/marketplace/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                step: "list_my_conversations",
                token,
                type,
            }),
        })
        const resData = await response.json()
        if (!response.ok) throw new Error(resData.error || "Failed to load conversations")
        return resData.conversations || []
    },
}
