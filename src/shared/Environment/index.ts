// @ts-nocheck

interface Environment {
  supabase: {
    url: string
    apiKey: string
  }
  isProduction: boolean
  environment: string
}

export const Environment: Environment = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    apiKey: process.env.NEXT_SUPABASE_KEY,
  },
  isProduction: process.env.NEXT_PUBLIC_ENV === "production",
  environment: process.env.NEXT_PUBLIC_ENV,
}
