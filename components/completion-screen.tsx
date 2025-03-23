import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircleIcon, HeartIcon } from "lucide-react"
import Link from "next/link"

interface CompletionScreenProps {
  userId: string | null
}

export default function CompletionScreen({ userId }: CompletionScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <Card>
          <CardContent className="p-8">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircleIcon className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Assessment Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for completing your personality assessment. We're analyzing your responses to find your perfect
              matches.
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-8">
              <div className="flex justify-center mb-4">
                <HeartIcon className="h-10 w-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Personality Profile ID</h3>
              <p className="text-gray-600 mb-4">Save this ID to access your matches later:</p>
              <div className="bg-white p-3 rounded-md font-mono text-lg border border-gray-200">
                {userId || "Profile ID will appear here"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

