import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || null

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or Key")
}

export default createClient(supabaseUrl, supabaseKey)
