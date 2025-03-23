import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Direct initialization of Supabase client for the API route
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

    // Check if questions already exist using raw SQL
    const { data: existingData, error: existingError } = await supabase.rpc("check_questions_exist")

    if (existingError) {
      // If the function doesn't exist, try a direct query
      const { data: checkData, error: checkError } = await supabase.from("questions").select("id").limit(1)

      if (checkError) {
        return NextResponse.json(
          {
            success: false,
            message: "Error checking existing questions: " + checkError.message,
          },
          { status: 500 },
        )
      }

      if (checkData && checkData.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Database already contains questions.`,
        })
      }
    } else if (existingData) {
      return NextResponse.json({
        success: false,
        message: `Database already contains questions.`,
      })
    }

    // Insert questions using raw SQL
    const { error: insertError } = await supabase.rpc("insert_sample_questions")

    if (insertError) {
      // If the function doesn't exist, try direct inserts
      const { error } = await supabase.from("questions").insert([
        {
          question_text: "What do you value most in a relationship?",
          category: "Values and Beliefs",
          options: ["Trust", "Communication", "Passion", "Shared interests", "Emotional support"],
          question_type: "multiple_choice",
        },
        {
          question_text: "How important is religion or spirituality in your life?",
          category: "Values and Beliefs",
          options: ["Very important", "Somewhat important", "Neutral", "Not very important", "Not important at all"],
          question_type: "multiple_choice",
        },
        // Add more questions here...
      ])

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Error seeding database: " + error.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded questions to the database.`,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while seeding the database.",
      },
      { status: 500 },
    )
  }
}

