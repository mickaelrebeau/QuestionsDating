import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 30 personality assessment questions covering various categories
const personalityQuestions = [
  // Values and beliefs
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
  {
    question_text: "How do you feel about traditional gender roles in relationships?",
    category: "Values and Beliefs",
    options: [
      "Strongly support them",
      "Somewhat support them",
      "Neutral",
      "Somewhat oppose them",
      "Strongly oppose them",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What's your approach to finances in a relationship?",
    category: "Values and Beliefs",
    options: [
      "Completely shared finances",
      "Mostly shared with some separate accounts",
      "Equal split of expenses",
      "Proportional to income",
      "Completely separate finances",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What are your core values that you wouldn't compromise on?",
    category: "Values and Beliefs",
    question_type: "text",
    options: null,
  },

  // Lifestyle preferences
  {
    question_text: "How would you describe your ideal weekend?",
    category: "Lifestyle Preferences",
    options: [
      "Outdoor adventures",
      "Social gatherings",
      "Relaxing at home",
      "Cultural activities",
      "Mix of activities",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What's your preferred living environment?",
    category: "Lifestyle Preferences",
    options: ["Big city", "Suburban area", "Small town", "Rural area", "Doesn't matter"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How often do you exercise?",
    category: "Lifestyle Preferences",
    options: ["Daily", "Several times a week", "Once a week", "Occasionally", "Rarely or never"],
    question_type: "multiple_choice",
  },
  {
    question_text: "What are your dietary preferences?",
    category: "Lifestyle Preferences",
    options: ["No restrictions", "Vegetarian", "Vegan", "Pescatarian", "Other specific diet"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How would you describe your sleep schedule?",
    category: "Lifestyle Preferences",
    options: ["Early bird", "Night owl", "Regular 9-5 schedule", "Irregular/varies", "Flexible"],
    question_type: "multiple_choice",
  },

  // Relationship goals
  {
    question_text: "What are you looking for in a relationship right now?",
    category: "Relationship Goals",
    options: ["Long-term commitment", "Marriage", "Casual dating", "Friendship first", "Not sure yet"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How do you feel about having children?",
    category: "Relationship Goals",
    options: [
      "Definitely want children",
      "Open to children",
      "Undecided",
      "Prefer not to have children",
      "Don't want children",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What's your timeline for settling down?",
    category: "Relationship Goals",
    options: [
      "Already looking to settle down",
      "Within the next few years",
      "Eventually but not soon",
      "No specific timeline",
      "Not interested in settling down",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "How important is marriage to you?",
    category: "Relationship Goals",
    options: ["Very important", "Somewhat important", "Neutral", "Not very important", "Not important at all"],
    question_type: "multiple_choice",
  },
  {
    question_text: "What does your ideal future with a partner look like?",
    category: "Relationship Goals",
    question_type: "text",
    options: null,
  },

  // Hobbies and interests
  {
    question_text: "What are your favorite ways to spend free time?",
    category: "Hobbies and Interests",
    options: [
      "Outdoor activities",
      "Reading/learning",
      "Creative pursuits",
      "Social activities",
      "Screen time (TV, games, etc.)",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "How important is it that your partner shares your hobbies?",
    category: "Hobbies and Interests",
    options: ["Very important", "Somewhat important", "Neutral", "Not very important", "Not important at all"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How often do you like to travel?",
    category: "Hobbies and Interests",
    options: [
      "As much as possible",
      "Several times a year",
      "Once or twice a year",
      "Rarely",
      "Not interested in travel",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What type of music do you enjoy most?",
    category: "Hobbies and Interests",
    options: ["Pop", "Rock", "Hip-hop/Rap", "Electronic", "Classical", "Country", "Jazz", "Eclectic/Various"],
    question_type: "multiple_choice",
  },
  {
    question_text: "Describe a hobby or passion that's important to you.",
    category: "Hobbies and Interests",
    question_type: "text",
    options: null,
  },

  // Communication style
  {
    question_text: "How do you prefer to resolve conflicts?",
    category: "Communication Style",
    options: [
      "Address immediately",
      "Take time to cool off first",
      "Discuss calmly",
      "Seek compromise",
      "Avoid confrontation",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "How often do you need personal space?",
    category: "Communication Style",
    options: ["Daily", "Several times a week", "Occasionally", "Rarely", "Almost never"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How do you express affection?",
    category: "Communication Style",
    options: ["Physical touch", "Words of affirmation", "Acts of service", "Quality time", "Giving gifts"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How open are you about your feelings?",
    category: "Communication Style",
    options: ["Very open", "Somewhat open", "Depends on the situation", "Somewhat reserved", "Very private"],
    question_type: "multiple_choice",
  },
  {
    question_text: "What's your communication style in a relationship?",
    category: "Communication Style",
    question_type: "text",
    options: null,
  },

  // Deal breakers
  {
    question_text: "Which of these would be a deal breaker for you?",
    category: "Deal Breakers",
    options: [
      "Different political views",
      "Different religious beliefs",
      "Long distance",
      "Has children",
      "Doesn't want children",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "How do you feel about smoking?",
    category: "Deal Breakers",
    options: ["Deal breaker", "Prefer non-smoker", "Occasional is ok", "Regular is ok", "I smoke too"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How do you feel about drinking alcohol?",
    category: "Deal Breakers",
    options: ["Deal breaker", "Occasional is ok", "Regular is ok", "I drink too", "Don't care"],
    question_type: "multiple_choice",
  },
  {
    question_text: "How important is physical attraction to you?",
    category: "Deal Breakers",
    options: [
      "Extremely important",
      "Very important",
      "Somewhat important",
      "Not very important",
      "Not important at all",
    ],
    question_type: "multiple_choice",
  },
  {
    question_text: "What are your absolute deal breakers in a relationship?",
    category: "Deal Breakers",
    question_type: "text",
    options: null,
  },
]

// Add these scale questions to the personalityQuestions array
const scaleQuestions = [
  {
    question_text: "How important is physical attraction in a relationship to you?",
    category: "Relationship Preferences",
    options: null,
    question_type: "scale",
  },
  {
    question_text: "How much do you value alone time?",
    category: "Lifestyle Preferences",
    options: null,
    question_type: "scale",
  },
  {
    question_text: "How comfortable are you with conflict in relationships?",
    category: "Communication Style",
    options: null,
    question_type: "scale",
  },
]

// Add these to your personalityQuestions array
personalityQuestions.push(...scaleQuestions)

export async function GET() {
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

    // Check if questions already exist
    const { data, error: countError } = await supabase.from("questions").select("id").limit(1)

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error checking existing questions: " + countError.message,
        },
        { status: 500 },
      )
    }

    if (data && data.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already contains questions.`,
      })
    }

    // Insert questions
    const { error } = await supabase.from("questions").insert(personalityQuestions)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error seeding database: " + error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${personalityQuestions.length} questions to the database.`,
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

