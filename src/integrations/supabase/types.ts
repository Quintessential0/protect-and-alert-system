export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      danger_reports: {
        Row: {
          danger_type: string
          description: string | null
          id: string
          location_lat: number
          location_lng: number
          reported_at: string | null
          severity_level: number | null
          status: string | null
          user_id: string
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          danger_type: string
          description?: string | null
          id?: string
          location_lat: number
          location_lng: number
          reported_at?: string | null
          severity_level?: number | null
          status?: string | null
          user_id: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          danger_type?: string
          description?: string | null
          id?: string
          location_lat?: number
          location_lng?: number
          reported_at?: string | null
          severity_level?: number | null
          status?: string | null
          user_id?: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          priority: number | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          priority?: number | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          priority?: number | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_incidents: {
        Row: {
          id: string
          location_accuracy: number | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          resolved_at: string | null
          status: string
          triggered_at: string
          user_id: string
        }
        Insert: {
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          resolved_at?: string | null
          status?: string
          triggered_at?: string
          user_id: string
        }
        Update: {
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          resolved_at?: string | null
          status?: string
          triggered_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fake_call_schedules: {
        Row: {
          contact_name: string
          contact_number: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_instant: boolean | null
          scheduled_time: string | null
          user_id: string
        }
        Insert: {
          contact_name: string
          contact_number: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_instant?: boolean | null
          scheduled_time?: string | null
          user_id: string
        }
        Update: {
          contact_name?: string
          contact_number?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_instant?: boolean | null
          scheduled_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      location_history: {
        Row: {
          accuracy: number | null
          id: string
          lat: number
          lng: number
          recorded_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          id?: string
          lat: number
          lng: number
          recorded_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          id?: string
          lat?: number
          lng?: number
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          emergency_plan: string | null
          full_name: string | null
          id: string
          location_permissions_granted: boolean | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          sos_gesture_enabled: boolean | null
          updated_at: string
          voice_monitoring_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          emergency_plan?: string | null
          full_name?: string | null
          id: string
          location_permissions_granted?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sos_gesture_enabled?: boolean | null
          updated_at?: string
          voice_monitoring_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          emergency_plan?: string | null
          full_name?: string | null
          id?: string
          location_permissions_granted?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sos_gesture_enabled?: boolean | null
          updated_at?: string
          voice_monitoring_enabled?: boolean | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          duration_seconds: number | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          incident_id: string
          recorded_at: string
          user_id: string
        }
        Insert: {
          duration_seconds?: number | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          incident_id: string
          recorded_at?: string
          user_id: string
        }
        Update: {
          duration_seconds?: number | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          incident_id?: string
          recorded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recordings_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "emergency_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_zones: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          radius_meters: number
          updated_at: string | null
          zone_type: string | null
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          radius_meters: number
          updated_at?: string | null
          zone_type?: string | null
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          radius_meters?: number
          updated_at?: string | null
          zone_type?: string | null
        }
        Relationships: []
      }
      safety_resources: {
        Row: {
          address: string | null
          category: string
          created_at: string | null
          email: string | null
          id: string
          is_24_7: boolean | null
          location_lat: number | null
          location_lng: number | null
          name: string
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_24_7?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_24_7?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          phone_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "user" | "admin" | "govt_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin", "govt_admin"],
    },
  },
} as const
