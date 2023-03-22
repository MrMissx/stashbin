import { createClient } from "@supabase/supabase-js"
import { Environment } from "../shared/Environment"

if (!Environment.supabase.url || !Environment.supabase.apiKey) {
  throw new Error("Missing Supabase URL or API key")
}

export default createClient(Environment.supabase.url, Environment.supabase.apiKey)
