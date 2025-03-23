"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SeedDirectPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const seedQuestions = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      // Execute SQL directly
      const response = await fetch("/api/seed-direct", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message,
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
          This page will seed the database with 30 personality assessment questions using direct SQL execution. Use this
          as a fallback if other methods don't work.
        </p>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button onClick={seedQuestions} disabled={isSeeding} className="w-full">
          {isSeeding ? "Seeding Database..." : "Seed Questions (Direct SQL)"}
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

