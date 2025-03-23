"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [bucketResult, setBucketResult] = useState<{ success: boolean; message: string } | null>(null)

  const seedQuestions = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "GET",
      })

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

  const createBucket = async () => {
    setBucketResult(null)

    try {
      const response = await fetch("/api/create-bucket", {
        method: "GET",
      })

      const data = await response.json()
      setBucketResult({
        success: data.success,
        message: data.message,
      })
    } catch (error) {
      console.error("Error creating bucket:", error)
      setBucketResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Seed Database</h1>
        <p className="mb-6 text-gray-600">
          This page will seed the database with personality assessment questions and create necessary storage buckets.
        </p>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button onClick={seedQuestions} disabled={isSeeding} className="w-full mb-4">
          {isSeeding ? "Seeding Database..." : "Seed Questions"}
        </Button>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Create Storage Bucket</h2>
          <p className="mb-4 text-gray-600">
            Create the storage bucket for user photos. This is required for the photo upload feature.
          </p>

          {bucketResult && (
            <Alert variant={bucketResult.success ? "default" : "destructive"} className="mb-4">
              <AlertDescription>{bucketResult.message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={createBucket} variant="outline" className="w-full">
            Create Photo Storage Bucket
          </Button>
        </div>

        {(result?.success || bucketResult?.success) && (
          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

