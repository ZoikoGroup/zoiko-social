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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adoption_listings: {
        Row: {
          age_years: number | null
          breed: string | null
          created_at: string
          description: string
          id: string
          name: string
          organization_id: string
          pet_id: string | null
          photo_urls: string[]
          species: Database["public"]["Enums"]["animal_category"]
          status: string
        }
        Insert: {
          age_years?: number | null
          breed?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          organization_id: string
          pet_id?: string | null
          photo_urls?: string[]
          species: Database["public"]["Enums"]["animal_category"]
          status?: string
        }
        Update: {
          age_years?: number | null
          breed?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          organization_id?: string
          pet_id?: string | null
          photo_urls?: string[]
          species?: Database["public"]["Enums"]["animal_category"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_listings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_listings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      breeding_listings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner_id: string
          pet_id: string
          review_state: Database["public"]["Enums"]["review_state"]
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          pet_id: string
          review_state?: Database["public"]["Enums"]["review_state"]
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          pet_id?: string
          review_state?: Database["public"]["Enums"]["review_state"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_listings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_bookings: {
        Row: {
          created_at: string
          end_at: string
          hourly_rate: number
          id: string
          notes: string | null
          pet_id: string
          provider_id: string
          seeker_id: string
          service_type: string
          start_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_at: string
          hourly_rate: number
          id?: string
          notes?: string | null
          pet_id: string
          provider_id: string
          seeker_id: string
          service_type: string
          start_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_at?: string
          hourly_rate?: number
          id?: string
          notes?: string | null
          pet_id?: string
          provider_id?: string
          seeker_id?: string
          service_type?: string
          start_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_bookings_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_members: {
        Row: {
          conversation_id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          id: string
          last_message_at: string | null
          name: string | null
          type: Database["public"]["Enums"]["conversation_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          type?: Database["public"]["Enums"]["conversation_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          type?: Database["public"]["Enums"]["conversation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          status: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          status?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          created_at: string
          document_url: string | null
          id: string
          notes: string | null
          owner_id: string
          pet_id: string
          record_date: string
          record_type: string
          title: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          id?: string
          notes?: string | null
          owner_id: string
          pet_id: string
          record_date: string
          record_type: string
          title: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          pet_id?: string
          record_date?: string
          record_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_share_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_revoked: boolean
          pet_id: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_revoked?: boolean
          pet_id: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_revoked?: boolean
          pet_id?: string
          shared_by_user_id?: string
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_share_tokens_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_share_tokens_shared_by_user_id_fkey"
            columns: ["shared_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_share_tokens_shared_with_user_id_fkey"
            columns: ["shared_with_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_found_reports: {
        Row: {
          contact_info: string
          created_at: string
          description: string
          id: string
          last_seen_location: string
          latitude: number | null
          longitude: number | null
          photo_urls: string[]
          reporter_id: string
          species: Database["public"]["Enums"]["animal_category"]
          status: Database["public"]["Enums"]["lost_found_status"]
          type: string
          updated_at: string
        }
        Insert: {
          contact_info: string
          created_at?: string
          description: string
          id?: string
          last_seen_location: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: string[]
          reporter_id: string
          species: Database["public"]["Enums"]["animal_category"]
          status?: Database["public"]["Enums"]["lost_found_status"]
          type: string
          updated_at?: string
        }
        Update: {
          contact_info?: string
          created_at?: string
          description?: string
          id?: string
          last_seen_location?: string
          latitude?: number | null
          longitude?: number | null
          photo_urls?: string[]
          reporter_id?: string
          species?: Database["public"]["Enums"]["animal_category"]
          status?: Database["public"]["Enums"]["lost_found_status"]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lost_found_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
          is_deleted: boolean
          media_urls: string[]
          sender_id: string
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean
          media_urls?: string[]
          sender_id: string
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean
          media_urls?: string[]
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_diary_entries: {
        Row: {
          author_id: string
          body: string | null
          created_at: string
          entry_date: string
          id: string
          media_urls: string[]
          pet_id: string
          title: string
          visibility: Database["public"]["Enums"]["post_visibility"]
        }
        Insert: {
          author_id: string
          body?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          media_urls?: string[]
          pet_id: string
          title: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Update: {
          author_id?: string
          body?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          media_urls?: string[]
          pet_id?: string
          title?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "pet_diary_entries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_diary_entries_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          breed: string | null
          created_at: string
          date_of_birth: string | null
          health_cert_state: Database["public"]["Enums"]["health_cert_state"]
          id: string
          is_private: boolean
          name: string
          owner_id: string
          species: Database["public"]["Enums"]["animal_category"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          breed?: string | null
          created_at?: string
          date_of_birth?: string | null
          health_cert_state?: Database["public"]["Enums"]["health_cert_state"]
          id?: string
          is_private?: boolean
          name: string
          owner_id: string
          species: Database["public"]["Enums"]["animal_category"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          breed?: string | null
          created_at?: string
          date_of_birth?: string | null
          health_cert_state?: Database["public"]["Enums"]["health_cert_state"]
          id?: string
          is_private?: boolean
          name?: string
          owner_id?: string
          species?: Database["public"]["Enums"]["animal_category"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          body: string | null
          comments_count: number
          created_at: string
          id: string
          is_deleted: boolean
          likes_count: number
          media_urls: string[]
          safety_cleared: boolean
          shares_count: number
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string
          visibility: Database["public"]["Enums"]["post_visibility"]
        }
        Insert: {
          author_id: string
          body?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          is_deleted?: boolean
          likes_count?: number
          media_urls?: string[]
          safety_cleared?: boolean
          shares_count?: number
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Update: {
          author_id?: string
          body?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          is_deleted?: boolean
          likes_count?: number
          media_urls?: string[]
          safety_cleared?: boolean
          shares_count?: number
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_listings: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          name: string
          photo_urls: string[]
          price: number
          review_state: Database["public"]["Enums"]["review_state"]
          seller_id: string
          status: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name: string
          photo_urls?: string[]
          price: number
          review_state?: Database["public"]["Enums"]["review_state"]
          seller_id: string
          status?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name?: string
          photo_urls?: string[]
          price?: number
          review_state?: Database["public"]["Enums"]["review_state"]
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          followers_count: number
          following_count: number
          id: string
          is_private: boolean
          posts_count: number
          role: Database["public"]["Enums"]["user_role"]
          state: Database["public"]["Enums"]["user_state"]
          trust_score: number
          updated_at: string
          username: string
          verification_tier: Database["public"]["Enums"]["verification_tier"]
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          followers_count?: number
          following_count?: number
          id: string
          is_private?: boolean
          posts_count?: number
          role?: Database["public"]["Enums"]["user_role"]
          state?: Database["public"]["Enums"]["user_state"]
          trust_score?: number
          updated_at?: string
          username: string
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          followers_count?: number
          following_count?: number
          id?: string
          is_private?: boolean
          posts_count?: number
          role?: Database["public"]["Enums"]["user_role"]
          state?: Database["public"]["Enums"]["user_state"]
          trust_score?: number
          updated_at?: string
          username?: string
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
          website_url?: string | null
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          business_name: string
          created_at: string
          id: string
          user_id: string
          verification_state: Database["public"]["Enums"]["verification_state"]
        }
        Insert: {
          business_name: string
          created_at?: string
          id?: string
          user_id: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
        }
        Update: {
          business_name?: string
          created_at?: string
          id?: string
          user_id?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_state: { Args: never; Returns: string }
      has_role: { Args: { role_name: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      animal_category:
        | "dog"
        | "cat"
        | "bird"
        | "rabbit"
        | "hamster"
        | "guinea_pig"
        | "fish"
        | "reptile"
        | "horse"
        | "farm_animal"
        | "exotic"
        | "other"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      conversation_type: "dm" | "group" | "community"
      health_cert_state: "none" | "pending" | "approved" | "expired"
      lost_found_status: "active" | "resolved"
      post_type: "text" | "image" | "video" | "reel" | "story"
      post_visibility: "public" | "followers" | "community" | "private"
      review_state: "pending" | "approved" | "rejected"
      user_role: "user" | "moderator" | "admin" | "super_admin"
      user_state: "active" | "suspended" | "banned" | "deleted"
      verification_state: "unverified" | "pending" | "verified" | "rejected"
      verification_tier:
        | "none"
        | "email"
        | "phone"
        | "identity"
        | "professional"
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
  public: {
    Enums: {
      animal_category: [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "hamster",
        "guinea_pig",
        "fish",
        "reptile",
        "horse",
        "farm_animal",
        "exotic",
        "other",
      ],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      conversation_type: ["dm", "group", "community"],
      health_cert_state: ["none", "pending", "approved", "expired"],
      lost_found_status: ["active", "resolved"],
      post_type: ["text", "image", "video", "reel", "story"],
      post_visibility: ["public", "followers", "community", "private"],
      review_state: ["pending", "approved", "rejected"],
      user_role: ["user", "moderator", "admin", "super_admin"],
      user_state: ["active", "suspended", "banned", "deleted"],
      verification_state: ["unverified", "pending", "verified", "rejected"],
      verification_tier: ["none", "email", "phone", "identity", "professional"],
    },
  },
} as const
