export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agent_memory: {
        Row: {
          context_key: string
          created_at: string | null
          id: string
          memory_value: string
          profile_id: string
          user_id: string
        }
        Insert: {
          context_key: string
          created_at?: string | null
          id?: string
          memory_value: string
          profile_id: string
          user_id: string
        }
        Update: {
          context_key?: string
          created_at?: string | null
          id?: string
          memory_value?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_memory_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          profile_id: string
          start_time: string
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          profile_id: string
          start_time: string
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          profile_id?: string
          start_time?: string
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      chameleon_links: {
        Row: {
          created_at: string | null
          id: string
          industry_context: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry_context?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry_context?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_queries: {
        Row: {
          created_at: string | null
          id: string
          portfolio_slug: string | null
          profile_user_id: string | null
          query_text: string
          response_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          portfolio_slug?: string | null
          profile_user_id?: string | null
          query_text: string
          response_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          portfolio_slug?: string | null
          profile_user_id?: string | null
          query_text?: string
          response_text?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component: string | null
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: []
      }
      identity_vault: {
        Row: {
          composite_trust_score: number | null
          created_at: string | null
          framework_alignment_score: number | null
          id: string
          is_verified: boolean | null
          metric_density_score: number | null
          project_id: string | null
          proof_validation_score: number | null
          user_id: string | null
        }
        Insert: {
          composite_trust_score?: number | null
          created_at?: string | null
          framework_alignment_score?: number | null
          id?: string
          is_verified?: boolean | null
          metric_density_score?: number | null
          project_id?: string | null
          proof_validation_score?: number | null
          user_id?: string | null
        }
        Update: {
          composite_trust_score?: number | null
          created_at?: string | null
          framework_alignment_score?: number | null
          id?: string
          is_verified?: boolean | null
          metric_density_score?: number | null
          project_id?: string | null
          proof_validation_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          ai_prep: Json | null
          company: string
          created_at: string | null
          id: string
          job_url: string | null
          role: string
          salary_range: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          ai_prep?: Json | null
          company: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          role: string
          salary_range?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          ai_prep?: Json | null
          company?: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          role?: string
          salary_range?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          id: string
          plan_id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_id: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_views: {
        Row: {
          created_at: string | null
          id: string
          persona_active: string | null
          profile_id: string | null
          referrer: string | null
          viewer_city: string | null
          viewer_company: string | null
          viewer_region: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          persona_active?: string | null
          profile_id?: string | null
          referrer?: string | null
          viewer_city?: string | null
          viewer_company?: string | null
          viewer_region?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          persona_active?: string | null
          profile_id?: string | null
          referrer?: string | null
          viewer_city?: string | null
          viewer_company?: string | null
          viewer_region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          data_json: Json
          id: string
          slug: string
          template_name: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          created_at?: string
          data_json?: Json
          id?: string
          slug: string
          template_name?: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          created_at?: string
          data_json?: Json
          id?: string
          slug?: string
          template_name?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_persona: string | null
          bio: string | null
          calendly_url: string | null
          created_at: string
          email: string | null
          font_config: Json | null
          full_name: string | null
          github_url: string | null
          headline: string | null
          hide_photo: boolean | null
          id: string
          is_pro: boolean | null
          key_highlights: string[] | null
          linkedin_url: string | null
          location: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          narrative_variants: Json | null
          photo_url: string | null
          plan_type: string | null
          predicted_domain: string | null
          pro_since: string | null
          projects: Json | null
          resume_data: Json | null
          resume_url: string | null
          selected_font: string | null
          selected_template: string | null
          skills: string[] | null
          subscription_id: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          views: number | null
          website: string | null
          work_experience: Json | null
        }
        Insert: {
          active_persona?: string | null
          bio?: string | null
          calendly_url?: string | null
          created_at?: string
          email?: string | null
          font_config?: Json | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          hide_photo?: boolean | null
          id?: string
          is_pro?: boolean | null
          key_highlights?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          narrative_variants?: Json | null
          photo_url?: string | null
          plan_type?: string | null
          predicted_domain?: string | null
          pro_since?: string | null
          projects?: Json | null
          resume_data?: Json | null
          resume_url?: string | null
          selected_font?: string | null
          selected_template?: string | null
          skills?: string[] | null
          subscription_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          views?: number | null
          website?: string | null
          work_experience?: Json | null
        }
        Update: {
          active_persona?: string | null
          bio?: string | null
          calendly_url?: string | null
          created_at?: string
          email?: string | null
          font_config?: Json | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          hide_photo?: boolean | null
          id?: string
          is_pro?: boolean | null
          key_highlights?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          narrative_variants?: Json | null
          photo_url?: string | null
          plan_type?: string | null
          predicted_domain?: string | null
          pro_since?: string | null
          projects?: Json | null
          resume_data?: Json | null
          resume_url?: string | null
          selected_font?: string | null
          selected_template?: string | null
          skills?: string[] | null
          subscription_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          views?: number | null
          website?: string | null
          work_experience?: Json | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          key: string
          request_count: number
          user_id: string | null
          window_start: string
        }
        Insert: {
          endpoint: string
          id?: string
          key: string
          request_count?: number
          user_id?: string | null
          window_start?: string
        }
        Update: {
          endpoint?: string
          id?: string
          key?: string
          request_count?: number
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      recruiter_chat_history: {
        Row: {
          ai_responses: string[] | null
          contact_reason: string | null
          created_at: string
          id: string
          profile_user_id: string
          visitor_company: string | null
          visitor_questions_asked: string[] | null
        }
        Insert: {
          ai_responses?: string[] | null
          contact_reason?: string | null
          created_at?: string
          id?: string
          profile_user_id: string
          visitor_company?: string | null
          visitor_questions_asked?: string[] | null
        }
        Update: {
          ai_responses?: string[] | null
          contact_reason?: string | null
          created_at?: string
          id?: string
          profile_user_id?: string
          visitor_company?: string | null
          visitor_questions_asked?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_chat_history_profile_user_id_fkey"
            columns: ["profile_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recruiter_chat_history_profile_user_id_fkey"
            columns: ["profile_user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          profile_id: string
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          profile_id: string
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          profile_id?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          payment_id: string
          plan_id: string
          started_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          payment_id: string
          plan_id: string
          started_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          payment_id?: string
          plan_id?: string
          started_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visit_logs: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          profile_user_id: string
          role_target: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: string
          profile_user_id: string
          role_target?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          profile_user_id?: string
          role_target?: string | null
        }
        Relationships: []
      }
      waitlist_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          bio: string | null
          calendly_url: string | null
          created_at: string | null
          font_config: Json | null
          full_name: string | null
          github_url: string | null
          headline: string | null
          id: string | null
          is_pro: boolean | null
          key_highlights: string[] | null
          linkedin_url: string | null
          location: string | null
          photo_url: string | null
          projects: Json | null
          resume_url: string | null
          selected_font: string | null
          selected_template: string | null
          skills: string[] | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          views: number | null
          website: string | null
          work_experience: Json | null
        }
        Insert: {
          bio?: string | null
          calendly_url?: string | null
          created_at?: string | null
          font_config?: Json | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string | null
          is_pro?: boolean | null
          key_highlights?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          photo_url?: string | null
          projects?: never
          resume_url?: string | null
          selected_font?: string | null
          selected_template?: string | null
          skills?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          views?: number | null
          website?: string | null
          work_experience?: Json | null
        }
        Update: {
          bio?: string | null
          calendly_url?: string | null
          created_at?: string | null
          font_config?: Json | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string | null
          is_pro?: boolean | null
          key_highlights?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          photo_url?: string | null
          projects?: never
          resume_url?: string | null
          selected_font?: string | null
          selected_template?: string | null
          skills?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          views?: number | null
          website?: string | null
          work_experience?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
