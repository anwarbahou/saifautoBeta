export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: number
          created_at: string | null
          make: string
          model: string
          year: number | null
          color: string | null
          license_plate: string | null
          status: string
          location: string | null
          last_maintenance: string | null
          next_maintenance: string | null
          mileage: number | null
          fuel_level: number | null
          insurance_expiry: string | null
          registration_expiry: string | null
          vin: string | null
          notes: string | null
          image_urls: string[] | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          make: string
          model: string
          year?: number | null
          color?: string | null
          license_plate?: string | null
          status?: string
          location?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          mileage?: number | null
          fuel_level?: number | null
          insurance_expiry?: string | null
          registration_expiry?: string | null
          vin?: string | null
          notes?: string | null
          image_urls?: string[] | null
        }
        Update: {
          id?: number
          created_at?: string | null
          make?: string
          model?: string
          year?: number | null
          color?: string | null
          license_plate?: string | null
          status?: string
          location?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          mileage?: number | null
          fuel_level?: number | null
          insurance_expiry?: string | null
          registration_expiry?: string | null
          vin?: string | null
          notes?: string | null
          image_urls?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 