"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface QuestionCardProps {
  question: {
    id: number
    question_text: string
    category: string
    options: string[] | null
    question_type: string
  }
  onAnswer: (answer: string) => void
  selectedAnswer?: string
}

export default function QuestionCard({ question, onAnswer, selectedAnswer }: QuestionCardProps) {
  const [value, setValue] = useState(selectedAnswer || "")
  const [textValue, setTextValue] = useState(selectedAnswer || "")
  const [scaleValue, setScaleValue] = useState<number[]>([selectedAnswer ? Number.parseInt(selectedAnswer) : 5])

  // Reset values when question changes
  useEffect(() => {
    setValue(selectedAnswer || "")
    setTextValue(selectedAnswer || "")
    setScaleValue([selectedAnswer ? Number.parseInt(selectedAnswer) : 5])
  }, [question.id, selectedAnswer])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onAnswer(newValue)
  }

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onAnswer(textValue)
    }
  }

  const handleScaleChange = (newValue: number[]) => {
    setScaleValue(newValue)
  }

  const handleScaleSubmit = () => {
    onAnswer(scaleValue[0].toString())
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{question.question_text}</CardTitle>
        <CardDescription>{question.category}</CardDescription>
      </CardHeader>
      <CardContent>
        {question.question_type === "multiple_choice" && question.options && question.options.length > 0 ? (
          <RadioGroup value={value} onValueChange={handleValueChange}>
            <div className="grid gap-2 grid-cols-1">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} className="peer sr-only" />
                  <label
                    htmlFor={option}
                    className="peer-checked:bg-pink-100 peer-checked:text-pink-900 relative block cursor-pointer rounded-md border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm focus:outline-none peer-checked:border-pink-500 peer-checked:ring-1 peer-checked:ring-pink-500 disabled:cursor-not-allowed peer-checked:ring-offset-1 w-full"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : question.question_type === "text" ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="min-h-[120px]"
            />
            <Button onClick={handleTextSubmit} disabled={!textValue.trim()} className="w-full">
              Submit Answer
            </Button>
          </div>
        ) : question.question_type === "scale" ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Not at all</span>
                <span>Somewhat</span>
                <span>Very much</span>
              </div>
              <Slider value={scaleValue} min={1} max={10} step={1} onValueChange={handleScaleChange} />
              <div className="text-center font-medium">Your rating: {scaleValue[0]}/10</div>
            </div>
            <Button onClick={handleScaleSubmit} className="w-full">
              Submit Rating
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p>This question type is not supported.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

