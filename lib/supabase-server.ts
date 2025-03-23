import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

export function createServerClient() {
  try {
    // Try to use the auth-helpers method first
    return createServerComponentClient<Database>({
      cookies,
    })
  } catch (error) {
    // Fallback to direct client creation if auth-helpers fails
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    return createClient<Database>(supabaseUrl, supabaseKey)
  }
}

