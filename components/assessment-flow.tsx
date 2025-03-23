"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import QuestionCard from "@/components/question-card"
import PhotoUpload from "@/components/photo-upload"
import UserDetailsForm from "@/components/user-details-form"
import { createClient } from "@supabase/supabase-js"
import ErrorDisplay from "./error-display"

type Question = {
  id: number
  question_text: string
  category: string
  options: string[] | null
  question_type: string
}

type Answer = {
  questionId: number
  questionText: string
  answer: string
  category: string
}

interface AssessmentFlowProps {
  initialQuestions: Question[]
}

export default function AssessmentFlow({ initialQuestions }: AssessmentFlowProps) {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    gender: "",
    age: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Initialize Supabase client
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Missing Supabase environment variables")
        }

        const client = createClient(supabaseUrl, supabaseKey)
        setSupabase(client)
      } catch (err) {
        console.error("Error initializing Supabase client:", err)
        setSupabaseError(err instanceof Error ? err.message : "Failed to initialize Supabase client")
      }
    }

    initializeSupabase()
  }, [])

  // If we have a Supabase initialization error, show it
  if (supabaseError) {
    return <ErrorDisplay error={supabaseError} />
  }

  // If we don't have any questions, show an error
  if (!initialQuestions || initialQuestions.length === 0) {
    return <ErrorDisplay error="No questions found. Please seed the database first." />
  }

  const totalSteps = initialQuestions.length + 2 // Questions + Photo Upload + User Details
  const currentQuestion = currentStep < initialQuestions.length ? initialQuestions[currentStep] : null
  const progress = Math.round((currentStep / totalSteps) * 100)

  const isPhotoUploadStep = currentStep === initialQuestions.length
  const isUserDetailsStep = currentStep === initialQuestions.length + 1
  const isLastStep = currentStep === totalSteps - 1

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question_text,
      answer,
      category: currentQuestion.category,
    }

    // Update or add the answer
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === currentQuestion.id)
      if (existingAnswerIndex >= 0) {
        const updated = [...prev]
        updated[existingAnswerIndex] = newAnswer
        return updated
      }
      return [...prev, newAnswer]
    })

    // For multiple choice, move to next question automatically after a short delay
    // For text and scale, the user will click the submit button which calls this function
    if (currentQuestion.question_type === "multiple_choice") {
      setTimeout(() => {
        handleNext()
      }, 500)
    } else {
      // For text and scale, move to next question immediately since they've already clicked submit
      handleNext()
    }
  }

  // Handle photo uploads
  const handlePhotosChange = (newPhotos: File[], newUrls: string[]) => {
    setPhotos(newPhotos)
    setPhotoUrls(newUrls)
  }

  // Handle user details update
  const handleUserDetailsChange = (details: typeof userDetails) => {
    setUserDetails(details)
  }

  // Navigation functions
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Submit all data to Supabase
  const handleSubmit = async () => {
    if (!supabase) {
      setError("Supabase client not initialized")
      return
    }

    if (photos.length < 3) {
      setError("Please upload at least 3 photos")
      return
    }

    if (!userDetails.fullName || !userDetails.email || !userDetails.gender || !userDetails.age) {
      setError("Please fill in all user details")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // 1. Insert user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          full_name: userDetails.fullName,
          email: userDetails.email,
          gender: userDetails.gender,
          age: Number.parseInt(userDetails.age),
        })
        .select()
        .single()

      if (userError) throw userError

      const userId = userData.id

      // 2. Upload photos to storage
      const photoPromises = photos.map(async (photo, index) => {
        const filePath = `${userId}/${Date.now()}-${photo.name}`
        const { error: uploadError } = await supabase.storage.from("user-photos").upload(filePath, photo)

        if (uploadError) throw uploadError

        return {
          user_id: userId,
          storage_path: filePath,
          display_order: index + 1,
        }
      })

      const photoData = await Promise.all(photoPromises)

      // 3. Insert photo references
      const { error: photoError } = await supabase.from("user_photos").insert(photoData)

      if (photoError) throw photoError

      // 4. Insert assessment responses
      const responseData = answers.map((answer) => ({
        user_id: userId,
        question_id: answer.questionId,
        question_text: answer.questionText,
        answer: answer.answer,
        category: answer.category,
      }))

      const { error: responseError } = await supabase.from("assessment_responses").insert(responseData)

      if (responseError) throw responseError

      // 5. Redirect to success page
      router.push("/assessment/success")
    } catch (err) {
      console.error("Error submitting assessment:", err)
      setError("An error occurred while submitting your assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {isPhotoUploadStep
              ? "Photo Upload"
              : isUserDetailsStep
                ? "User Details"
                : `Question ${currentStep + 1} of ${initialQuestions.length}`}
          </span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-[400px] flex flex-col">
        {/* Question step */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answers.find((a) => a.questionId === currentQuestion.id)?.answer}
          />
        )}

        {/* Photo upload step */}
        {isPhotoUploadStep && <PhotoUpload photos={photos} photoUrls={photoUrls} onPhotosChange={handlePhotosChange} />}

        {/* User details step */}
        {isUserDetailsStep && (
          <UserDetailsForm
            userDetails={userDetails}
            onChange={handleUserDetailsChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}

        {/* Navigation buttons */}
        <div className="mt-auto pt-6 flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {!isUserDetailsStep && (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep < initialQuestions.length && !answers.find((a) => a.questionId === currentQuestion?.id)) ||
                (isPhotoUploadStep && photos.length < 3) ||
                isSubmitting
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

