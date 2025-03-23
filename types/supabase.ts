export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: number
          question_text: string
          category: string
          options: Json | null
          question_type: "multiple_choice" | "text" | "scale"
          created_at: string | null
        }
        Insert: {
          question_text: string
          category: string
          options: Json | null
          question_type: "multiple_choice" | "text" | "scale"
          created_at?: string | null
        }
        Update: {
          question_text?: string
          category?: string
          options?: Json | null
          question_type?: "multiple_choice" | "text" | "scale"
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_questions_exist: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      insert_sample_questions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

