import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorDisplayProps {
  error: string
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>

        <p className="text-gray-600 mb-8">{error}</p>

        <div className="space-y-4">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>

          <Link href="/seed">
            <Button className="w-full">Seed Questions</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

