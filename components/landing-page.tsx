"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, MessageCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LandingPageProps {
  questionsExist: boolean
}

export default function LandingPage({ questionsExist }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect Match</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Our personality assessment helps you connect with compatible partners based on what truly matters.
            </p>

            {!questionsExist && (
              <Alert variant="warning" className="mb-6 bg-yellow-100 border-yellow-400 text-yellow-800">
                <AlertDescription>
                  Please seed the database with questions before starting the assessment.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {questionsExist ? (
                <Link href="/assessment">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/seed">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Seed Questions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 md:py-24">
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personality Matching</h3>
            <p className="text-gray-600">
              Our algorithm analyzes 30+ personality traits to find your most compatible matches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Connections</h3>
            <p className="text-gray-600">
              Connect with people who share your values, interests, and relationship goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Meaningful Conversations</h3>
            <p className="text-gray-600">Start conversations based on shared interests and compatibility points.</p>
          </div>
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-pink-500 font-bold">1</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Complete the Assessment</h3>
                <p className="text-gray-600 mt-2">
                  Answer questions about your personality, values, and what you're looking for in a relationship.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-pink-500 font-bold">2</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Upload Your Photos</h3>
                <p className="text-gray-600 mt-2">
                  Add at least 3 photos that show the real you and help potential matches get to know you better.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-pink-500 font-bold">3</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Get Matched</h3>
                <p className="text-gray-600 mt-2">
                  Our algorithm will find your most compatible matches based on your assessment results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} HeartMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

