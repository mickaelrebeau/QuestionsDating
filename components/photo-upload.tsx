"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PhotoUploadProps {
  photos: File[]
  photoUrls: string[]
  onPhotosChange: (photos: File[], urls: string[]) => void
}

export default function PhotoUpload({ photos, photoUrls, onPhotosChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    setError("")
    const newFiles: File[] = []
    const newUrls: string[] = []

    // Check file types and sizes
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]

      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed")
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Images must be less than 5MB")
        return
      }

      newFiles.push(file)
      newUrls.push(URL.createObjectURL(file))
    }

    // Update photos state
    const updatedPhotos = [...photos, ...newFiles]
    const updatedUrls = [...photoUrls, ...newUrls]

    onPhotosChange(updatedPhotos, updatedUrls)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos]
    const updatedUrls = [...photoUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedUrls[index])

    updatedPhotos.splice(index, 1)
    updatedUrls.splice(index, 1)

    onPhotosChange(updatedPhotos, updatedUrls)
  }

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-bold mb-6">Upload Your Photos</h2>
      <p className="text-gray-600 mb-4">
        Please upload at least 3 photos of yourself. These will be used to create your profile.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">Drag and drop your photos here</p>
        <p className="text-gray-500 mb-4">or</p>
        <Button type="button" onClick={() => fileInputRef.current?.click()}>
          Browse Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Photo Guidelines:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Upload at least 3 photos</li>
          <li>Photos should clearly show your face</li>
          <li>Include at least one full-body photo</li>
          <li>Maximum file size: 5MB per photo</li>
          <li>Accepted formats: JPG, PNG, GIF</li>
        </ul>
      </div>

      {photoUrls.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Uploaded Photos ({photoUrls.length}/3 minimum):</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photoUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Uploaded photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {photoUrls.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500">No photos uploaded yet</p>
        </div>
      )}
    </div>
  )
}

