"use client"

import type React from "react"

import { useEffect, useState } from "react"
import ErrorDisplay from "./error-display"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setError(error.error)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (error) {
    return <ErrorDisplay error={error.message} />
  }

  return <>{children}</>
}

