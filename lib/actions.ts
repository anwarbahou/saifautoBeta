"use server"

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
// Import createClient from the regular supabase-js SDK
import { createClient } from '@supabase/supabase-js'

// This function remains for other actions that might use it successfully
export async function createServerSupabaseClient() {
  // Attempt to await cookies() as suggested by linter hints
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
      },
    }
  )
}

// Cars actions
export async function getCars() {
  const supabase = await createServerSupabaseClient() // Continues to use ssr client
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cars:", error)
    return []
  }

  return data
}

export async function addCar(car: any): Promise<{ success: boolean; data?: any; error?: string; fieldErrors?: Record<string, string> }> {
  // TEMPORARY DEBUGGING LOGS REMOVED
  // console.log("[SERVER ACTION DEBUG] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
  // console.log("[SERVER ACTION DEBUG] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Use the regular Supabase client with Service Role Key for this action
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
        auth: {
            autoRefreshToken: false, 
        }
    }
  );

  try {
    const { data, error } = await supabaseAdmin 
      .from("cars")
      .insert([
        {
          make: car.make,
          model: car.model,
          year: car.year,
          category: car.category,
          color: car.color,
          license_plate: car.licensePlate,
          status: car.status,
          daily_rate: car.dailyRate,
          images: car.images || [],
          primary_image: car.primaryImage || null,
        },
      ])
      .select()
      .single(); 

    if (error) {
      // Log the raw error for precise message checking
      console.log("RAW DB ERROR in addCar:", JSON.stringify(error, null, 2)); 
      console.error("Database error in addCar (message property):", error.message);

      if (error.message.includes("duplicate key value violates unique constraint") && error.message.includes("cars_license_plate_key")) {
        return { success: false, error: "A car with this license plate already exists." };
      }
      console.error("Full Supabase error object (after duplicate check failed):", error);
      return { success: false, error: "A database error occurred while adding the car. Check server logs for details." }; 
    }

    if (!data) {
        return { success: false, error: "Failed to add car, no data returned from database." };
    }

    return { success: true, data: data };

  } catch (e: any) {
    console.error("Unexpected error in addCar action:", e);
    return { success: false, error: "An unexpected server error occurred. Please check server logs." };
  }
}

export async function updateCar(car: any): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabaseAdmin
      .from("cars")
      .update({
        make: car.make,
        model: car.model,
        year: car.year,
        category: car.category,
        color: car.color,
        license_plate: car.licensePlate,
        status: car.status,
        daily_rate: car.dailyRate,
        images: car.images || [],
        primary_image: car.primaryImage || null,
      })
      .eq("id", car.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating car:", error);
      // Check for specific errors if needed, e.g., duplicate license plate if it can be changed and conflicts
      if (error.message.includes("duplicate key value violates unique constraint") && error.message.includes("cars_license_plate_key")) {
        return { success: false, error: "A car with this license plate already exists. Cannot update." };
      }
      return { success: false, error: "Failed to update car: " + error.message };
    }
    if (!data) {
      return { success: false, error: "Failed to update car, no data returned after update." };
    }
    return { success: true, data: data };
  } catch (e: any) {
    console.error("Unexpected error in updateCar action:", e);
    return { success: false, error: "An unexpected server error occurred while updating the car." };
  }
}

export async function deleteCar(id: number): Promise<{ success: boolean; error?: string }> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error deleting car:", error);
      return { success: false, error: "Failed to delete car: " + error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("Unexpected error in deleteCar action:", e);
    return { success: false, error: "An unexpected server error occurred while deleting the car." };
  }
}

// Clients actions
export async function getClients() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("clients").select("*").order("id")

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data
}

// Bookings actions
export async function getBookings() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (id, name, email),
      cars (id, make, model, license_plate)
    `)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data
}

export async function getRecentBookings(limit = 5) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (id, name),
      cars (id, make, model)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent bookings:", error)
    return []
  }

  return data
}

// Dashboard stats
export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()

  // For now, return mock data
  // TODO: Implement real database queries
  return {
    totalRevenue: 15420.50,
    activeBookings: 8,
    availableCars: 12,
    totalClients: 45,
  }
}
