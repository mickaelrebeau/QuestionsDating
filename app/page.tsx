import LandingPage from "@/components/landing-page"
import { createServerClient } from "@/lib/supabase-server"

export default async function Home() {
  let questionsExist = false

  try {
    const supabase = createServerClient()

    // Check if we have questions in the database
    const { data, error } = await supabase.from("questions").select("id").limit(1)

    if (error) {
      console.error("Error checking questions:", error)
    } else {
      questionsExist = data && data.length > 0
    }
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
  }

  return (
    <main className="min-h-screen">
      <LandingPage questionsExist={questionsExist} />
    </main>
  )
}

