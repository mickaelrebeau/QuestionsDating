import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>

        <p className="text-gray-600 mb-8">
          Thank you for completing our personality assessment. Your responses have been recorded and will be used to
          find your most compatible matches.
        </p>

        <p className="text-gray-600 mb-8">
          We'll analyze your personality profile and notify you when we have potential matches that align with your
          values, interests, and relationship goals.
        </p>

        <Link href="/">
          <Button className="w-full">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}

