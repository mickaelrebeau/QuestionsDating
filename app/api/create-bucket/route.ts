import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Direct initialization of Supabase client for the API route
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error checking buckets: " + bucketsError.message,
        },
        { status: 500 },
      )
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "user_photos")

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("user_photos", {
        public: false,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      })

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            message: "Error creating bucket: " + createError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Successfully created user_photos bucket",
      })
    }

    return NextResponse.json({
      success: true,
      message: "user_photos bucket already exists",
    })
  } catch (error) {
    console.error("Error creating bucket:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while creating the bucket.",
      },
      { status: 500 },
    )
  }
}

