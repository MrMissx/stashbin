const SLUG_LENGTH = 10
const AVAILABLE_SLUG = "abcdefghijklmnopqrstuvwxyz"

export const createSlug = () => {
    return Array.from(
        { length: SLUG_LENGTH },
        () => AVAILABLE_SLUG[Math.floor(Math.random() * AVAILABLE_SLUG.length)]
    ).join("")
}
