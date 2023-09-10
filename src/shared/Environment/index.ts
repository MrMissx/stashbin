// @ts-nocheck

interface Environment {
  gatewayUrl: string
  isProduction: boolean
  environment: string
}

export const Environment: Environment = {
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
  isProduction: process.env.NEXT_PUBLIC_ENV === "production",
  environment: process.env.NEXT_PUBLIC_ENV,
}
