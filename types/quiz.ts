export interface Question {
  id: number
  question_text: string
  category: string
  options: Record<string, string> | null
  question_type: "multiple_choice" | "text" | "scale"
  created_at?: string
}

