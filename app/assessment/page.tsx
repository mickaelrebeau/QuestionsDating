import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import AssessmentFlow from "@/components/assessment-flow"
import ErrorDisplay from "@/components/error-display"

export default async function AssessmentPage() {
  let questions = []
  let error = null

  try {
    // Direct initialization of Supabase client for more reliability
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all questions from the database
    const { data, error: fetchError } = await supabase.from("questions").select("*").order("id", { ascending: true })

    if (fetchError) {
      throw new Error(`Error fetching questions: ${fetchError.message}`)
    }

    if (!data || data.length === 0) {
      // If no questions exist, redirect to home page
      redirect("/")
    }

    questions = data
  } catch (err) {
    console.error("Error in assessment page:", err)
    error = err instanceof Error ? err.message : "An unexpected error occurred"
  }

  // If we have an error but no questions, show the error
  if (error && questions.length === 0) {
    return <ErrorDisplay error={error} />
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AssessmentFlow initialQuestions={questions} />
    </main>
  )
}

