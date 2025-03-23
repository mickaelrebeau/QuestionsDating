"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserDetailsFormProps {
  userDetails: {
    fullName: string
    email: string
    gender: string
    age: string
  }
  onChange: (details: any) => void
  onSubmit: () => void
  isSubmitting: boolean
  error: string
}

export default function UserDetailsForm({
  userDetails,
  onChange,
  onSubmit,
  isSubmitting,
  error,
}: UserDetailsFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...userDetails, [field]: value })
  }

  const isFormValid = () => {
    return (
      userDetails.fullName.trim() !== "" &&
      userDetails.email.trim() !== "" &&
      userDetails.gender !== "" &&
      userDetails.age !== "" &&
      Number.parseInt(userDetails.age) >= 18
    )
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      onSubmit()
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-bold mb-6">Almost Done! Tell Us About Yourself</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={userDetails.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={userDetails.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender Identity</Label>
          <Select value={userDetails.gender} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select your gender identity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="120"
            value={userDetails.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Enter your age"
          />
          {userDetails.age && Number.parseInt(userDetails.age) < 18 && (
            <p className="text-sm text-red-500">You must be at least 18 years old</p>
          )}
        </div>

        <Button type="submit" disabled={!isFormValid() || isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Complete Assessment"}
        </Button>
      </form>
    </div>
  )
}

