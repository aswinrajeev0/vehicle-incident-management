export function formatDateTime(value?: string | null) {
    if (!value) return "—"
    try {
        return new Date(value).toLocaleString()
    } catch {
        return value
    }
}

export function formatCurrency(value?: number | null, currency = "INR", locale = "en-US") {
    if (value == null) return "—"
    try {
        return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
    } catch {
        return String(value)
    }
}

export function lastSegment(path: string) {
    try {
        const url = new URL(path)
        return url.pathname.split("/").pop() || path
    } catch {
        const parts = path.split("/")
        return parts[parts.length - 1] || path
    }
}
