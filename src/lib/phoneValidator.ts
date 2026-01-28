export function validateCameroonPhone(phone: string): { isValid: boolean; error?: string } {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '')

    // Check if it's exactly 9 digits
    if (!/^\d{9}$/.test(cleaned)) {
        return { isValid: false, error: 'Phone number must be exactly 9 digits' }
    }

    // Check if it starts with 6
    if (!cleaned.startsWith('6')) {
        return { isValid: false, error: 'Phone number must start with 6' }
    }

    return { isValid: true }
}

export function formatCameroonPhone(phone: string): string {
    const cleaned = phone.replace(/[\s-]/g, '')
    // Format as XXX XXX XXX
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}
