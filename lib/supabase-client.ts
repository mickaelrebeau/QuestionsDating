import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export function getSupabaseClient() {
  try {
    // Try to use the auth-helpers method first
    return createClientComponentClient<Database>()
  } catch (error) {
    // Fallback to direct client creation if auth-helpers fails
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    return createClient<Database>(supabaseUrl, supabaseKey)
  }
}

