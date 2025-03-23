"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SeedSqlPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const seedQuestions = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const supabase = createClientComponentClient()

      // Check if questions already exist
      const { data, error: countError } = await supabase.from("questions").select("id").limit(1)

      if (countError) {
        throw new Error("Error checking existing questions: " + countError.message)
      }

      if (data && data.length > 0) {
        setResult({
          success: false,
          message: "Database already contains questions.",
        })
        return
      }

      // Insert questions one by one to avoid potential issues
      for (const question of personalityQuestions) {
        const { error } = await supabase.from("questions").insert([question])

        if (error) {
          throw new Error("Error inserting question: " + error.message)
        }
      }

      setResult({
        success: true,
        message: `Successfully seeded ${personalityQuestions.length} questions to the database.`,
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Seed Database (Direct SQL)</h1>
        <p className="mb-6 text-gray-600">
          This page will seed the database with 30 personality assessment questions using direct client-side SQL. Use
          this as a fallback if the API route method doesn't work.
        </p>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button onClick={seedQuestions} disabled={isSeeding} className="w-full">
          {isSeeding ? "Seeding Database..." : "Seed Questions (Direct)"}
        </Button>

        {result && result.success && (
          <div className="mt-6 text-center">
            <p className="text-green-600 mb-4">Database seeded successfully!</p>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// 30 personality assessment questions covering various categories
const personalityQuestions = [
  // Values and beliefs
  {
    question_text: "What do you value most in a relationship?",
    category: "Values and Beliefs",
    options: ["Trust", "Communication", "Passion", "Shared interests", "Emotional support"],
    question_type: "multiple_choice",
  },
  // ... (rest of the questions remain the same)
]

